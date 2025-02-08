import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ArtistNav = () => {
  const location = useLocation();

  // Hàm kiểm tra active của link
  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-blue-600' // Khi active: text màu xanh đậm
      : 'text-white';   // Khi không active: mặc định là trắng
  };

  return (
    <nav className="bg-gray-900 p-4 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Tiêu đề trang */}
        <div className="text-xl font-bold">
          <Link to="/" className="text-red-700 font-bold">
            WuyiMusic
          </Link>
        </div>
        {/* Các link điều hướng */}
        <div className="flex space-x-6">
          <Link 
            to="/artist" 
            className={`${isActive('/artist')} hover:text-blue-500`}
          >
            Home
          </Link>
          <Link 
            to="/artist/profile" 
            className={`${isActive('/artist/profile')} hover:text-blue-500`}
          >
            Profile
          </Link>
          <Link 
            to="/artist/upload" 
            className={`${isActive('/artist/upload')} hover:text-blue-500`}
          >
            Upload
          </Link>
          <Link 
            to="/artist/tracks" 
            className={`${isActive('/artist/tracks')} hover:text-blue-500`}
          >
            My Track
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default ArtistNav;
