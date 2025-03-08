import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrackService from '../../../Services/TrackService';
import ArtistServices from '../../../Services/ArtistServices';
import AlbumService from '../../../Services/AlbumService';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useMusic } from '../PlayerMusicControl/MusicContext';
import Card from './card';

const Discover = () => {
  const [ListSong, setListSong] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [artistData, setArtistData] = useState([]);
  const [albumData, setAlbumData] = useState([]);
  const [error, setError] = useState('');
  const { currentTrack, playTrack, isPlaying, playPause, setTracks, playAlbum } = useMusic();
  const navigate = useNavigate();

  const fetchTrack = async () => {
    try {
      setIsLoading(true);
      const response = await TrackService.GetRandomTracks();
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
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy dữ liệu nghệ sĩ");
      console.error("Error fetching artist data:", err);
      setArtistData([]);
    }
  };

  const fetchAlbum = async () => {
    try {
      const response = await AlbumService.getAllAlbums();
      console.log("Dữ liệu Albums là:", response.data);
      setAlbumData(response.data);
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy dữ liệu album");
      console.error("Error fetching album data:", err);
      setAlbumData([]);
    }
  };

  useEffect(() => {
    fetchTrack();
    fetchArtist();
    fetchAlbum();
  }, []);

  const handleRefreshArtists = () => {
    fetchArtist();
  };

  return (
    <div className="w-full min-h-[calc(180vh-4rem)] bg-[#111727] overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Tracks Section */}
        {ListSong.length > 0 && (
          <>
            <div className="mt-6 mb-4 flex justify-between items-center">
              <span className="text-white font-semibold">Gợi ý cho bạn</span>
              <button
                className="text-white/80 hover:text-white"
                onClick={() => navigate('/all-tracks')}
              >
                Hiện tất cả
              </button>
            </div>

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
          </>
        )}

        {/* Artists Section */}
        {artistData.length > 0 && (
          <div className="mt-8 mx-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold">Nghệ sĩ</span>
              <button
                className="text-white/80 font-semibold hover:text-white"
                onClick={handleRefreshArtists}
              >
                Làm mới
              </button>
            </div>
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
        )}

        {/* Albums Section */}
        {albumData && albumData.length > 0 && (
          <div className="mt-8 mx-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold text-xl">Albums</span>
              <button
                className="text-white/80 hover:text-white"
                onClick={() => navigate('/all-albums')}
              >
                Hiện tất cả
              </button>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide">
              {albumData.map((album) => (
                <div
                  key={album.albumId || album.id}
                  className="flex-shrink-0 flex flex-col items-start bg-gray-800 p-4 rounded-lg shadow-md transition-transform hover:scale-105 w-56"
                >
                  <div className="relative group">
                    <img
                      className="w-52 h-52 object-cover rounded-lg"
                      src={album.albumImage}
                      alt={album.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="transition-transform duration-200 transform hover:scale-[1.1]"
                        onClick={() => playAlbum(album.albumId)}
                      >
                        <PlayCircleOutlined className="text-white text-5xl" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 text-left">
                    <span className="max-w-52 block text-lg font-light text-white truncate">
                      {album.title}
                    </span>
                    <span className="block text-sm text-gray-400 hover:text-white transition-colors">
                      {album.artist?.name || 'Nghệ sĩ không xác định'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-white">Đang tải...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-red-500">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;