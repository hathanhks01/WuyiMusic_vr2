import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock,
  faMusic,
  faUser,
  faEdit,
  faSpinner,
  faTimes,
  faCheckCircle,
  faCompactDisc
} from '@fortawesome/free-solid-svg-icons';
import ArtistServices from '../../../Services/ArtistServices';

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-gray-700 bg-gray-800 shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const EditForm = ({ artist, onClose }) => {
  const [formData, setFormData] = useState({
    name: artist.name,
    bio: artist.bio,
    artistImageFile: null
  });
  const [preview, setPreview] = useState(artist.artistImage);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, artistImageFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('Name', formData.name.trim());
      formPayload.append('Bio', formData.bio?.trim() || '');

      if (formData.artistImageFile) {
        formPayload.append('ArtistImageFile', formData.artistImageFile);
      }

      await ArtistServices.UpdateArtist(artist.artistId, formPayload);
      onClose(true);
    } catch (error) {
      console.error('Update failed:', error);
      alert(`Lỗi cập nhật: ${error.response?.data || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chỉnh sửa thông tin</h2>
          <button 
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-white"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Tên nghệ sĩ</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Tiểu sử</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full p-2 rounded bg-gray-700 h-32 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Ảnh đại diện</label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-sm text-gray-400">Nhấn để thay đổi ảnh</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faCheckCircle} />
              )}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Profile = () => {
  const [artistData, setArtistData] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('tracks');

  const fetchArtist = async () => {
    try {
      const response = await ArtistServices.GetArtistByUserId();
      setArtistData(response);
    } catch (error) {
      console.error("Error fetching artist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <FontAwesomeIcon 
          icon={faSpinner} 
          className="animate-spin text-4xl text-yellow-500"
        />
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <p className="text-xl text-red-500">Không tìm thấy thông tin nghệ sĩ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {showEdit && <EditForm artist={artistData} onClose={(refresh) => {
        setShowEdit(false);
        refresh && fetchArtist();
      }} />}

      <div className="relative h-96">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex items-end gap-6 relative z-10">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-yellow-500 overflow-hidden shadow-xl">
                <img
                  src={artistData.artistImage}
                  alt={artistData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowEdit(true)}
                className="absolute bottom-2 right-2 bg-yellow-600 p-2 rounded-full hover:bg-yellow-700 transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <h1 className="text-4xl font-bold mb-2">{artistData.name}</h1>
              <p className="text-gray-300 max-w-2xl">{artistData.bio}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => setSelectedSection('tracks')}
            className={`rounded-lg border p-4 text-left transition-colors ${
              selectedSection === 'tracks' 
                ? 'border-yellow-500 bg-yellow-500/10' 
                : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FontAwesomeIcon 
                icon={faMusic}
                className={`h-8 w-8 mr-3 ${
                  selectedSection === 'tracks' ? 'text-yellow-500' : 'text-blue-500'
                }`}
              />
              <div>
                <p className="text-sm text-gray-400">Bài hát</p>
                <p className="text-2xl font-bold">{artistData.tracks?.length || 0}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedSection('albums')}
            className={`rounded-lg border p-4 text-left transition-colors ${
              selectedSection === 'albums' 
                ? 'border-yellow-500 bg-yellow-500/10' 
                : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FontAwesomeIcon 
                icon={faUser}
                className={`h-8 w-8 mr-3 ${
                  selectedSection === 'albums' ? 'text-yellow-500' : 'text-purple-500'
                }`}
              />
              <div>
                <p className="text-sm text-gray-400">Albums</p>
                <p className="text-2xl font-bold">{artistData.albums?.length || 0}</p>
              </div>
            </div>
          </button>

          <Card>
            <CardContent className="flex items-center">
              <FontAwesomeIcon 
                icon={faClock}
                className="h-8 w-8 text-green-500 mr-3"
              />
              <div>
                <p className="text-sm text-gray-400">Tham gia</p>
                <p className="text-lg">
                  {new Date(artistData.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16 max-h-screen overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">
            {selectedSection === 'tracks' ? 'Danh sách bài hát' : 'Danh sách album'}
          </h2>
          
          {selectedSection === 'tracks' ? (
            <div className="grid gap-4">
              {artistData.tracks.map((track) => (
                <Card key={track.trackId}>
                  <CardContent className="flex items-center">
                    <div className="h-16 w-16 rounded overflow-hidden mr-4">
                      <img
                        src={track.trackImage}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{track.title}</h3>
                      <p className="text-gray-400">{track.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {artistData.albums.map((album) => (
                <Card key={album.albumId}>
                  <CardContent className="flex items-center">
                    <div className="h-16 w-16 rounded overflow-hidden mr-4 bg-gray-700">
                      {album.albumImage ? (
                        <img
                          src={album.albumImage}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faCompactDisc} className="text-2xl text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{album.title}</h3>
                      <p className="text-gray-400">
                        {album.releaseDate && new Date(album.releaseDate).toLocaleDateString('vi-VN')} • 
                        {album.tracks?.length || 0} bài hát
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;