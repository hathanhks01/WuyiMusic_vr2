import React, { useEffect, useState } from 'react';
import { PlayCircleOutlined, PauseCircleOutlined, HeartFilled } from '@ant-design/icons';
import { useMusic } from '../PlayerMusicControl/MusicContext';
import TrackService from '../../../Services/TrackService';
import FavoriteServices from '../../../Services/FavoriteServices';

const LikedList = () => {
  const [likedTracks, setLikedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentTrack, playTrack, isPlaying, playPause } = useMusic();
  const [hoveredTrackId, setHoveredTrackId] = useState(null);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  const fetchLikedTracks = async () => {
    if (!userId) {
      setError('Please log in to view liked tracks');
      setLoading(false);
      return;
    }

    try {
      const response = await TrackService.GetFavoriteTrack(userId);
      if (response && Array.isArray(response)) {
        setLikedTracks(response);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setLikedTracks([]);
      } else {
        setError(err.message || 'Error fetching liked tracks');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedTracks();
  }, [userId]);

  const handleTrackDoubleClick = (track) => {
    if (!track.filePath) {
      console.error('Track has no file path:', track);
      return;
    }
    
    if (currentTrack?.trackId === track.trackId && isPlaying) {
      playPause();
    } else {
      playTrack(track);
    }
  };

  const handleRemoveTrack = async (trackId) => {
    if (!userId) {
      setError('Please log in to remove tracks');
      return;
    }

    try {
      await FavoriteServices.Remove(userId, trackId);
      // Immediately update UI by removing the track
      setLikedTracks(prevTracks => 
        prevTracks.filter(track => track.trackId !== trackId)
      );
    } catch (error) {
      console.error('Error removing track:', error);
      // Optionally show error message to user
    }
  };

  if (!userId) {
    return (
      <div className="text-white text-center p-8">
        Please log in to view your liked songs
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  if (likedTracks.length === 0) {
    return (
      <div className="text-white text-center p-8">
        No liked tracks found
      </div>
    );
  }

  return (
    <div className="p-2 pb-16">
      <h2 className="text-white text-xl font-bold mb-4">Bài hát đã thích</h2>
      <div className="flex flex-col space-y-4 mb-28">
        {likedTracks.map((track) => (
          <div
            key={track.trackId}
            className="relative flex items-center bg-[#1a1f32] p-4 rounded-xl cursor-pointer hover:bg-[#272e47] transition-colors"
            onMouseEnter={() => setHoveredTrackId(track.trackId)}
            onMouseLeave={() => setHoveredTrackId(null)}
            onDoubleClick={() => handleTrackDoubleClick(track)}
          >
            <div className="relative ">
              <img 
                src={track.trackImage} 
                alt={track.title} 
                className="w-16 h-16 rounded-md object-cover"
              />
              {hoveredTrackId === track.trackId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackDoubleClick(track);
                  }}
                  className="absolute inset-0 flex items-center justify-center text-3xl text-white/80 hover:text-white transition-transform bg-black/30"
                >
                  {currentTrack?.trackId === track.trackId && isPlaying ? (
                    <PauseCircleOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )}
                </button>
              )}
            </div>
            
            <div className="flex-1 text-white ml-4">
              <span className="block text-sm font-semibold">
                {track.title || 'Untitled'}
              </span>
              <span className="block text-sm text-white/70">
                {track.artist?.name || 'Unknown Artist'}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTrack(track.trackId);
              }}
              className="p-2 hover:scale-110 transition-transform"
              title="Remove from liked songs"
            >
              <HeartFilled className="text-red-500 text-xl" />
            </button>

            <span className="text-white/70 ml-4 min-w-[60px] text-right">
              {track.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedList;