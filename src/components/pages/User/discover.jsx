import React, { useEffect, useState } from 'react';
import TrackService from '../../../Services/TrackService';
import ArtistServices from '../../../Services/ArtistServices';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useMusic } from '../PlayerMusicControl/MusicContext';
import Card from './card';

const Discover = () => {
  const [ListSong, setListSong] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [artistData, setArtistData] = useState([]);
  const [error, setError] = useState('');
  const { currentTrack, playTrack, isPlaying, playPause, setTracks } = useMusic();

  const fetchTrack = async () => {
    try {
      setIsLoading(true);
      const response = await TrackService.GetAllTrack();
      console.log('Dữ liệu bài hát:', response);
      setListSong(response);
      setTracks(response);
    } catch (error) {
      console.error('Lỗi khi tải bài hát:', error);
      setError('Không thể tải danh sách bài hát');
      setListSong([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtist = async () => {
    try {
      const response = await ArtistServices.GetRamdomArtist();
      console.log("Dữ liệu nghệ sĩ là:", response);
      setArtistData(response);
      // Nếu cần hiệu ứng gõ chữ, bạn có thể gọi hàm startTypingEffect ở đây
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy dữ liệu nghệ sĩ");
      console.error("Error fetching artist data:", err);
    }
  };

  useEffect(() => {
    fetchTrack();
    fetchArtist();
  }, []);

  const handleRefreshArtists = () => {
    fetchArtist();
  };

  return (
    <div className="w-full min-h-[calc(140vh-4rem)] bg-[#111727]  overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mt-6 mb-4 flex justify-between items-center">
          <span className="text-white font-semibold">Gợi ý cho bạn</span>
          <a className="text-white/80 hover:text-white" href="/#">
            TẤT CẢ {'>'}
          </a>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-white">Đang tải...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ListSong.map((track) => (
              <div
                key={track.trackId}
                className="flex items-center p-4 rounded-xl shadow-md bg-[#1a1f32] space-x-4"
              >
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
                      playPause(); // Dừng nếu đang phát
                    } else {
                      if (!track.filePath) {
                        console.error('Bài hát không có filePath:', track);
                        return;
                      }
                      playTrack(track); // Phát bài hát
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

        {/* Phần nghệ sĩ */}
        <div className="mt-8 mx-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-semibold">Nghệ sĩ</span>
            <button
              className="text-white/80 font-semibold hover:text-white"
              onClick={handleRefreshArtists}
            >
              LÀM MỚI
            </button>
          </div>
          {/* Sử dụng flex kết hợp overflow-x-auto để danh sách nghệ sĩ cuộn ngang */}
          <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide">
            {artistData.map((artist) => (
              <Card
                key={artist.artistId}
                name={artist.name}
                aboutMe={artist.bio}
                profilePic={artist.artistImage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
