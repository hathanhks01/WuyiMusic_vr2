import React, { useEffect, useState } from 'react';
import TrackService from '../../../Services/TrackService';
import { PlayCircleOutlined, PauseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useMusic } from '../PlayerMusicControl/MusicContext';
import { useNavigate } from 'react-router-dom';

const AllTracks = () => {
  const [ListSong, setListSong] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTrack, playTrack, isPlaying, playPause, setTracks } = useMusic();
  const navigate = useNavigate();


  const fetchTrack = async () => {
    try {
      setIsLoading(true);
      const response = await TrackService.GetAllTrack();
      
      // Lọc ra những bài hát có trackId duy nhất
      const uniqueTracks = [...new Map(response.map(track => [track.trackId, track])).values()];
      
      setListSong(uniqueTracks); // Cập nhật danh sách không trùng
      setTracks(uniqueTracks);
    } catch (error) {
      console.error('Lỗi khi tải bài hát:', error);
      setListSong([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#111727] overflow-y-auto p-6">
      <div className="max-w-screen-xl mx-auto">     
        <h1 className="text-white text-2xl font-bold mb-4">Danh sách tất cả bài hát</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-white">Đang tải...</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {ListSong.map((track, index) => (
              <div
              key={`${track.trackId}-list-${index}`}
                className="flex items-center p-4 rounded-lg shadow-md bg-[#1a1f32] space-x-4"
              >
                <span className="text-white text-lg w-8">{index + 1}</span>
                <div className="w-16 h-16 overflow-hidden rounded-md">
                  <img
                    src={track.trackImage}
                    alt={track.trackName || 'Track Image'}
                    className="w-full h-full object-cover"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                  />
                </div>
                <div className="flex-1 text-white">
                  <span className="block text-sm font-semibold">{track.title}</span>
                </div>
                <button
                  onClick={() => {
                    if (currentTrack?.trackId === track.trackId && isPlaying) {
                      playPause();
                    } else {
                      if (!track.filePath) {
                        console.error('Bài hát không có filePath:', track);
                        return;
                      }
                      playTrack(track);
                    }
                  }}
                  className="text-3xl text-white/80 hover:text-white transition-transform"
                >
                  {currentTrack?.trackId === track.trackId && isPlaying ? (
                    <PauseCircleOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTracks;
