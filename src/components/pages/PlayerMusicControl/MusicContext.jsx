import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Thêm state mới cho queue và history
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
      console.log("Bài hát hiện tại đã kết thúc:", currentTrack);
      console.log("Hàng đợi trước khi phát bài tiếp theo:", queue);
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
  }, [queue]); // Add queue to dependency array

  const loadTrack = (track) => {
    audioRef.current.src = track.filePath;
    audioRef.current.load();
    setCurrentTime(0);
  };

  // Thêm functions mới cho queue management
  const addToQueue = (track) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const removeFromQueue = (trackId) => {
    setQueue(prevQueue => prevQueue.filter(track => track.trackId !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const addToHistory = (track) => {
    if (!track) return;
    
    setPlayHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter(
        (historyTrack) => 
          historyTrack.trackId !== track.trackId
      );
            const newHistory = [track, ...filteredHistory];
            return newHistory.slice(0, 20);
    });
  };

  const playTrackFromQueue = (trackId) => {
    const trackIndex = queue.findIndex(track => track.trackId === trackId);
    if (trackIndex !== -1) {
      const track = queue[trackIndex];
      // Xóa các bài hát trước bài được chọn khỏi queue
      setQueue(prevQueue => prevQueue.slice(trackIndex + 1));
      playTrack(track);
    }
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

  const nextTrack = () => {
    console.log("Hàng đợi trước khi phát bài tiếp theo:", queue);
   if (queue.length > 0) {
    const [nextTrack, ...remainingTracks] = queue;
    setQueue(remainingTracks); // ✅ Cập nhật queue mới
    playTrack(nextTrack);
    addRemainingTracksToQueue(tracks.indexOf(nextTrack)); // ✅ Thêm các bài còn lại
  } else if (tracks.length > 0) {
      // Fallback to the next track in the tracks array if queue is empty
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
      // Lấy bài hát gần nhất từ lịch sử
      const previousTrack = playHistory[0];
      setPlayHistory(prevHistory => prevHistory.slice(1));
      // Thêm bài hát hiện tại vào đầu queue
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

  const addRemainingTracksToQueue = (startIndex) => {
    const remainingTracks = tracks.slice(startIndex + 1);
    setQueue(prevQueue => [...prevQueue, ...remainingTracks]);
  };
  const getCurrentTrack = () => tracks[currentTrackIndex];

  const playTrack = (track) => {
    const trackIndex = tracks.findIndex((t) => t.trackId === track.trackId);
    if (trackIndex !== -1) {
      const currentTrack = getCurrentTrack();
      if (currentTrack && currentTrack.trackId !== track.trackId) {
        addToHistory(currentTrack);
      }
      
      // Clear existing queue and remove current track from queue and history
      setQueue(prevQueue => 
        prevQueue.filter(queueTrack => queueTrack.trackId !== track.trackId)
      );
      
      setPlayHistory(prevHistory => 
        prevHistory.filter(historyTrack => historyTrack.trackId !== track.trackId)
      );
      
      addRemainingTracksToQueue(trackIndex);
      
      setCurrentTrackIndex(trackIndex);
      audioRef.current.src = track.filePath;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Error playing track:", error));
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
      // Thêm các giá trị mới
      queue,
      playHistory,
      addToQueue,
      removeFromQueue,
      clearQueue,
      playTrackFromQueue,
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