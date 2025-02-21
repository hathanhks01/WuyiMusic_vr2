import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import QueueServices from '../../../Services/QueueServices';

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

  const audioRef = useRef(new Audio());

  useEffect(() => {
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
  }, [queue]);

  const loadTrack = (track) => {
    audioRef.current.src = track.filePath;
    audioRef.current.load();
    setCurrentTime(0);
  };

  const addToHistory = (track) => {
    if (!track) return;
    
    setPlayHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter(
        (historyTrack) => historyTrack.trackId !== track.trackId
      );
      const newHistory = [track, ...filteredHistory];
      return newHistory.slice(0, 20);
    });
  };

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

  const nextTrack = async () => {
    if (queue.length > 0) {
      const [nextQueueItem, ...remainingQueueItems] = queue;
      if (nextQueueItem && nextQueueItem.track) {
        // Lấy thông tin track từ queueItem
        const trackToPlay = nextQueueItem.track;
        
        // Cập nhật queue còn lại
        setQueue(remainingQueueItems);
  
        // Cập nhật index và load bài hát
        const trackIndex = tracks.findIndex(t => t.trackId === trackToPlay.trackId);
        if (trackIndex !== -1) {
          setCurrentTrackIndex(trackIndex);
          
          // Load và phát nhạc từ filePath
          audioRef.current.src = trackToPlay.filePath;
          audioRef.current.load();
          if (isPlaying) {
            audioRef.current.play().catch(console.error);
          }
        }
      }
    } else if (tracks.length > 0) {
      // Xử lý khi hết queue - giữ nguyên code cũ
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      loadTrack(tracks[nextIndex]);
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const previousTrack = () => {
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
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolumeLevel = (level) => {
    setVolume(level);
    audioRef.current.volume = level / 100;
  };

  const getCurrentTrack = () => tracks[currentTrackIndex];

  const playTrack = async (track) => {
    try {
      const trackIndex = tracks.findIndex((t) => t.trackId === track.trackId);
      if (trackIndex !== -1) {
        const currentTrack = getCurrentTrack();
        if (currentTrack && currentTrack.trackId !== track.trackId) {
          addToHistory(currentTrack);
        }

        // Create new queue using API
        const userInfo = JSON.parse(localStorage.getItem('user'));
        const response = await QueueServices.CreateQueue(userInfo.userId, track.trackId);
        if (response && response.data) {
          console("dữ liệu queue là " + response)
          setQueue(response.data.queueItems || []);
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
  };

  const toggleQueueVisibility = () => {
    setIsQueueVisible(!isQueueVisible);
  };

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
      queue,
      setQueue,
      playHistory,
      isQueueVisible,
      toggleQueueVisibility
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