import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HeartOutlined, HeartFilled, PlayCircleOutlined, PauseCircleOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { useMusic } from '../pages/PlayerMusicControl/MusicContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeOff, faVolumeHigh, faMusic, faList, faShuffle, faRepeat } from '@fortawesome/free-solid-svg-icons';
import QueueSidebar from '../pages/User/QueueSidebar';

const Footer = () => {
  const {
    currentTrack,
    previousTrack,
    nextTrack,
    isPlaying,
    playPause,
    seekTo,
    setVolumeLevel,
    currentTime,
    duration,
    volume,
    isQueueVisible,
    toggleQueueVisibility
  } = useMusic();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      document.title = `${currentTrack.title}  - WuyiMusic`; // Update the title here
    } else {
      document.title = 'WuyiMusic'; // Default title
    }
  }, [currentTrack]);
  // Format time helper function
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle time seek
  const handleTimeSeek = (event) => {
    const newTime = (event.target.value / 100) * duration;
    seekTo(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value);
    setVolumeLevel(newVolume);
  };

  const userId = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).userId
    : null;

  useEffect(() => {
    const checkIfTrackFavorited = async () => {
      if (currentTrack && userId) {
        try {
          const response = await axios.get(`https://localhost:7078/api/FavoriteTracks/is-favorited?userId=${userId}&trackId=${currentTrack.trackId}`);
          setIsLiked(response.data.isFavorited);
        } catch (error) {
          console.error("Error checking if track is favorited:", error);
        }
      }
    };

    checkIfTrackFavorited();
  }, [currentTrack, userId]);

  const handleLikeToggle = async () => {
    if (!userId || !currentTrack) return;

    const trackId = currentTrack.trackId;
    try {
      if (isLiked) {
        const response = await axios.delete(`https://localhost:7078/api/FavoriteTracks/remove?userId=${userId}&trackId=${trackId}`, {
          data: { userId, trackId }
        });
        console.log(response.data.message);
      } else {
        const response = await axios.post(`https://localhost:7078/api/FavoriteTracks/add?userId=${userId}&trackId=${trackId}`);
        console.log(response.data.message);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating favorite track:", error);
    }
  };

  useEffect(() => {
    const checkIfTrackFavorited = async () => {
      if (currentTrack) {
        try {
          const response = await axios.get(`https://localhost:7078/api/FavoriteTracks/is-favorited?userId=${userId}&trackId=${currentTrack.trackId}`);
          setIsLiked(response.data.isFavorited);
        } catch (error) {
          console.error("Error checking if track is favorited:", error);
        }
      }
    };

    checkIfTrackFavorited();
  }, [currentTrack, userId]);

  // Lắng nghe sự kiện phím
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Space
        playPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playPause]);

  return (
    <div className='w-full h-24 bg-black text-white text-center fixed bottom-0'>
      <div className="flex w-full h-full">
        {/* Track Info Section */}
        <div className="flex-1 flex items-center justify-start">
          <div className="w-12 h-12 m-4 overflow-hidden flex items-center">
            <img
              src={currentTrack?.trackImage || "src/assets/image/miaomiao.jpg"}
              alt={currentTrack?.title || ""}
              className='w-full h-full object-cover'
            />
          </div>
          <div className="flex flex-col">
            <span>{currentTrack?.title || " "}</span>
            <span className='text-xs text-white/80'>{currentTrack?.artist || ""}</span>
          </div>
          <button
            onClick={handleLikeToggle}
            className={`p-4 rounded ${isLiked ? 'text-red-500' : 'text-white'}`}
            title={isLiked ? 'Xóa khỏi thư viện' : 'Thêm vào thư viện'}
          >
            {isLiked ? <HeartFilled /> : <HeartOutlined />}
          </button>
        </div>

        {/* Playback Controls Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className='w-full'>
            <div className="flex justify-center items-center space-x-4">
            <button
                className="text-xl p-2 text-white/50 hover:text-white hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faRepeat} />
              </button>
              <button
                onClick={previousTrack}
                className="text-2xl p-2 text-white/50 hover:text-white hover:scale-105 transition-transform">
                <StepBackwardOutlined />
              </button>
              <button
                onClick={playPause}
                className="text-4xl p-0 hover:scale-105 transition-transform"
              >
                {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              </button>
              <button
                onClick={nextTrack}
                className="text-2xl p-2 text-white/50 hover:text-white hover:scale-105 transition-transform">
                <StepForwardOutlined />
              </button>
              <button
              
                className="text-xl p-2 text-white/50 hover:text-white hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faShuffle} />
              </button>
            </div>

            {/* Time Progress Bar */}
            <div className="flex items-center w-full px-2 ">
              <span className='p-1'>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={(currentTime / (duration || 1)) * 100}
                onChange={handleTimeSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none"
                style={{
                  background: `linear-gradient(to right, white ${(currentTime / (duration || 1)) * 100}%, gray ${(currentTime / (duration || 1)) * 100}%)`,
                }}
                tabIndex="-1"
              />
              <span className='p-1'>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Volume Controls Section */}
        <div className="flex-1 flex items-center justify-end pr-7 space-x-4">
          <div className="flex items-center">
            <span className="text-xs mr-2 p-4">
              <FontAwesomeIcon icon={volume === 0 ? faVolumeOff : faVolumeHigh} />
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, white ${volume}%, gray ${volume}%)`,
              }}
            />
          </div>
          <button className='border-l border-l-white/50 pl-2 text-white/50 hover:text-white'>
            <FontAwesomeIcon icon={faMusic} />
          </button>
          <button
            onClick={toggleQueueVisibility}
            className={`text-white/50 hover:text-white ${isQueueVisible ? 'text-white' : ''}`}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>
      </div>
      <QueueSidebar isOpen={isQueueVisible} onClose={toggleQueueVisibility} />
    </div>
  );
};

export default Footer;
