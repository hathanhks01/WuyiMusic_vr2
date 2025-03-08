import React, { useEffect, useState } from 'react';
import AlbumService from '../../../Services/AlbumService';
import { useNavigate } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';

const AlbumPage = () => {
  const [albumData, setAlbumData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAlbums = async () => {
    try {
      setIsLoading(true);
      const response = await AlbumService.getAllAlbums();
      setAlbumData(response.data);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải danh sách album');
      console.error('Error fetching albums:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#111727] overflow-y-auto p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <span className="text-white text-2xl font-semibold">Danh sách Album</span>
          <button className="text-white/80 hover:text-white" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-white">Đang tải...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albumData.map((album) => (
              <div
                key={album.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform hover:scale-105"
              >
                <div className="relative group">
                  <img
                    className="w-full h-56 object-cover rounded-lg"
                    src={album.albumImage}
                    alt={album.title}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="transition-transform duration-200 transform hover:scale-[1.1]">
                      <PlayCircleOutlined className="text-white text-5xl" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-left">
                  <span className="block text-lg font-light text-white truncate">{album.title}</span>
                  <span className="block text-sm text-gray-400 hover:text-white transition-colors">
                    {album.artist.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumPage;
