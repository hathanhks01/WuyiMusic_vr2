import React, { createContext, useState, useContext, useRef, useCallback } from 'react';
import QueueServices from '../../../Services/QueueServices';
import TrackService from '../../../Services/TrackService';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [playHistory, setPlayHistory] = useState([]);
  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const [queueSource, setQueueSource] = useState('track'); // 'track' hoặc 'album'

  const audioRef = useRef(new Audio());

  // 1. Định nghĩa các hàm helper cơ bản trước
  const getCurrentTrack = useCallback(() => tracks[currentTrackIndex], [tracks, currentTrackIndex]);

  const loadTrack = useCallback((track) => {
    if (!track || !track.filePath) {
      console.error("Không thể load track: ", track);
      return;
    }
    audioRef.current.src = track.filePath;
    audioRef.current.load();
    setCurrentTime(0);
  }, []);

  const addToHistory = useCallback((track) => {
    if (!track) return;
    setPlayHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter(
        (historyTrack) => historyTrack.trackId !== track.trackId
      );
      const newHistory = [track, ...filteredHistory];
      return newHistory.slice(0, 20);
    });
  }, []);

  const playAlbum = useCallback(async (albumId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const response = await QueueServices.CreateQueueFromAlbumAsync(
        userInfo.userId,
        albumId
      );
  
      if (response?.data) {
        const queueItems = response.data.queueItems || [];
        const albumTracks = queueItems.map(qi => qi.track);
        
        // Đặt queueSource là 'album'
        setQueueSource('album');
        
        // Lấy ID của bài đầu tiên trong album (position = 0)
        const firstTrackItem = queueItems.find(item => item.position === 0);
        const currentTrackId = firstTrackItem?.trackId || response.data.currentTrackId;
        
        // Tìm index track hiện tại trong albumTracks
        const initialIndex = albumTracks.findIndex(
          track => track.trackId === currentTrackId
        );
  
        // Cập nhật state
        setTracks(albumTracks);
        setQueue(queueItems);
        setCurrentTrackIndex(initialIndex !== -1 ? initialIndex : 0);
  
        // Load và phát track đầu tiên
        if (albumTracks.length > 0) {
          const trackToPlay = albumTracks[initialIndex !== -1 ? initialIndex : 0];
          if (trackToPlay) {
            const audio = audioRef.current;
            audio.src = trackToPlay.filePath;
            audio.load();
            
            // Xử lý autoplay policy
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(error => {
                  console.log("Cần tương tác người dùng để phát:", error);
                  // Hiển thị UI yêu cầu click
                });
            }
          }
        }
      }
    } catch (error) {
      console.error("Lỗi phát album:", error);
    }
  }, [setTracks, setQueue]);


  // 2. Định nghĩa playTrack trước vì nó được sử dụng bởi previousTrack
  const playTrack = useCallback(async (track) => {
    try {
      const trackIndex = tracks.findIndex((t) => t.trackId === track.trackId);
      if (trackIndex !== -1) {
        const currentTrack = getCurrentTrack();
        if (currentTrack && currentTrack.trackId !== track.trackId) {
          addToHistory(currentTrack);
        }

        const userInfo = JSON.parse(localStorage.getItem('user'));
        const response = await QueueServices.CreateQueue(userInfo.userId, track.trackId);
      await TrackService.IncrementListenCount(track.trackId)
        if (response && response.data) {
          setQueue(response.data.queueItems || []);
          setQueueSource('track');
        }
       
        setCurrentTrackIndex(trackIndex);
        audioRef.current.src = track.filePath;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => console.error("Error playing track:", error));
      }
    } catch (error) {
      console.error("Error creating queue:", error);
    }
  }, [tracks, getCurrentTrack, addToHistory]);

  // 3. Sau đó định nghĩa previousTrack vì nó phụ thuộc vào playTrack
  const previousTrack = useCallback( async() => {
    if (playHistory.length > 0) {
      const previousTrack = playHistory[0];
      setPlayHistory(prevHistory => prevHistory.slice(1));
      const currentTrack = getCurrentTrack();
      if (currentTrack) {
        setQueue(prevQueue => [currentTrack, ...prevQueue]);
      }
      playTrack(previousTrack);
    } else if (tracks.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(prevIndex);
      loadTrack(tracks[prevIndex]);
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [playHistory, tracks, currentTrackIndex, isPlaying, getCurrentTrack, loadTrack, playTrack]);

  // 4. Định nghĩa nextTrack đã được sửa
// Hàm nextTrack được sửa để theo dõi position trong queue
const nextTrack = useCallback(async () => {
  const currentTrack = getCurrentTrack();
  
  if (queue.length > 0) {
    // Tìm vị trí hiện tại trong queue
    const currentQueueItemIndex = queue.findIndex(
      item => item.trackId === (currentTrack?.trackId || '')
    );
    
    // Lấy item tiếp theo trong queue dựa theo position
    let nextQueueItem;
    
    if (currentQueueItemIndex !== -1) {
      // Tìm item có position lớn hơn 1
      const currentPosition = queue[currentQueueItemIndex].position;
      nextQueueItem = queue.find(item => item.position === currentPosition + 1);
    } else {
      // Nếu không tìm thấy bài hiện tại trong queue, lấy bài đầu tiên
      nextQueueItem = queue.find(item => item.position === 0);
    }
    
    // Nếu tìm thấy bài tiếp theo
    if (nextQueueItem?.track) {
      // Tìm index trong tracks array
      const nextTrackIndex = tracks.findIndex(
        t => t.trackId === nextQueueItem.trackId
      );
      
      if (nextTrackIndex !== -1) {
        // Bài tiếp theo đã có trong tracks array
        setCurrentTrackIndex(nextTrackIndex);
        loadTrack(tracks[nextTrackIndex]);
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      } else if (nextQueueItem.track) {
        // Bài tiếp theo không có trong tracks array, thêm vào
        const updatedTracks = [...tracks, nextQueueItem.track];
        setTracks(updatedTracks);
        setCurrentTrackIndex(updatedTracks.length - 1);
        loadTrack(nextQueueItem.track);
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    } else {
      // Nếu không có bài tiếp theo, quay lại bài đầu tiên (nếu chế độ lặp lại)
      const firstQueueItem = queue.find(item => item.position === 0);
      if (firstQueueItem?.track) {
        // Tìm index trong tracks array
        const firstTrackIndex = tracks.findIndex(
          t => t.trackId === firstQueueItem.trackId
        );
        
        if (firstTrackIndex !== -1) {
          setCurrentTrackIndex(firstTrackIndex);
          loadTrack(tracks[firstTrackIndex]);
          if (isPlaying) {
            audioRef.current.play().catch(console.error);
          }
        }
      }
    }
  } 
  // Fallback nếu không có queue
  else if (tracks.length > 0) {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    loadTrack(tracks[nextIndex]);
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }
}, [queue, tracks, currentTrackIndex, loadTrack, isPlaying, getCurrentTrack]);
  // 5. Các hàm đơn giản
  const playPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolumeLevel = (level) => {
    setVolume(level);
    audioRef.current.volume = level / 100;
  };

  const toggleQueueVisibility = () => {
    setIsQueueVisible(!isQueueVisible);
  };

  // 6. useEffect cuối cùng
  React.useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      const currentTrack = getCurrentTrack();
      if (currentTrack) {
        addToHistory(currentTrack);
      }
      nextTrack();
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    audio.volume = volume / 100;
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, nextTrack, getCurrentTrack, addToHistory]);

  return (
    <MusicContext.Provider value={{
      tracks,
      setTracks,
      currentTrack: getCurrentTrack(),
      isPlaying,
      volume,
      currentTime,
      duration,
      playPause,
      nextTrack,
      previousTrack,
      seekTo,
      setVolumeLevel,
      playTrack,
      playAlbum,
      queue,
      setQueue,
      playHistory,
      isQueueVisible,
      toggleQueueVisibility,
      queueSource,
      setQueueSource
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic phải được sử dụng trong MusicProvider');
  }
  return context;
};

export default MusicContext;