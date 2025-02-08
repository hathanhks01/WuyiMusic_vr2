import React, { useEffect, useState } from 'react';
import { Clock, Music, User } from 'lucide-react';
import ArtistServices from '../../../Services/ArtistServices';

// Custom Card components
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

const Profile = () => {
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await ArtistServices.GetArtistByUserId();
        console.log("Dữ liệu nghệ sĩ là:", response);
        setArtistData(response);
      } catch (err) {
        setError("Có lỗi xảy ra khi lấy dữ liệu nghệ sĩ");
        console.error("Error fetching artist data:", err);
      }
    };

    fetchArtist();
  }, []);

  if (error) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative h-80 w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        <div className="absolute bottom-0 left-0 p-8 flex items-end space-x-6">
          <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img 
              src={artistData.artistImage} 
              alt={artistData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mb-4">
            <h1 className="text-4xl font-bold mb-2">{artistData.name}</h1>
            <p className="text-gray-300">{artistData.bio}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center">
              <Music className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Bài hát</p>
                <p className="text-2xl font-bold">{artistData.tracks.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center">
              <User className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Albums</p>
                <p className="text-2xl font-bold">{artistData.albums.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center">
              <Clock className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Thời gian tham gia</p>
                <p className="text-lg">{new Date(artistData.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracks Section */}
     {/* Tracks Section */}
<div className="mb-16 max-h-screen overflow-y-auto">
  <h2 className="text-2xl font-bold mb-4">Bài hát</h2>
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
</div>

      </div>
    </div>
  );
};

export default Profile;