import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import TrackService from "../../Services/TrackService";

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
  });
  // State to disable the search effect after selecting a result
  const [disableSearch, setDisableSearch] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);



  // When the user types manually, ensure search is enabled.
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setDisableSearch(false);
  };

  useEffect(() => {
    if (disableSearch) return; // Skip search if disabled

    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, disableSearch]);

  const performSearch = async () => {
    if (search.trim() === "") {
      setSearchResults({ tracks: [], artists: [] });
      return;
    }

    try {
      const response = await TrackService.searchTerm(search);
      navigate("/searchComponenet", { state: { searchResults: response } });
      setSearchResults(response);
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults({ tracks: [], artists: [] });
    }
  };

  // When a result is clicked, fill the input with the clicked value
  const handleSearchResultClick = (value) => {
    setSearch(value);
    setSearchResults({ tracks: [], artists: [] });
    setDisableSearch(true); // Prevent immediate re-search on input change
  };

  const handleLoginSuccess = (userInfo) => {
    setUser(userInfo);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsRegisterMode(false);
  };

  const renderSearchResults = () => {
    // Optionally, only show dropdown when there are results.
    if (!search || (searchResults.tracks.length === 0 && searchResults.artists.length === 0)) return null;

    return (
      <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-lg z-50">
        {searchResults.tracks.length > 0 && (
          <div className="p-2">
            <h3 className="text-white font-bold mb-2">Tracks</h3>
            {searchResults.tracks.map((track, index) => (
              <div
                key={`track-${track.trackId || index}`}
                className="text-white hover:bg-gray-700 p-2 rounded cursor-pointer"
                onClick={() => handleSearchResultClick(track.title)}
              >
                {track.title}
              </div>
            ))}
          </div>
        )}
        {searchResults.artists.length > 0 && (
          <div className="p-2">
            <h3 className="text-white font-bold mb-2">Artists</h3>
            {searchResults.artists.map((artist, index) => (
              <div
                key={`artist-${artist.artistId || index}`}
                className="text-white hover:bg-gray-700 p-2 rounded cursor-pointer"
                onClick={() => handleSearchResultClick(artist.name)}
              >
                {artist.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2 flex justify-between fixed top-0 left-0 w-full z-[9999] bg-black">
      <div className="flex pr-3 items-center gap-8">
        <Link to="/" className="text-[30px] text-red-700 font-bold">
          WuyiMusic
        </Link>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Bạn muốn phát nội dung gì"
            className="bg-gray-800 border border-gray-300 h-8 p-2 w-96 rounded-3xl text-white"
            value={search}
            onChange={handleSearchChange}
          />
          {renderSearchResults()}
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <a
          href="/artist"
          className="hover:text-red-700 text-white"
        >
          For Artist
        </a>
        <div
          className="actions"
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          {user ? (
            <>
              <span className="text-white">Xin chào, {user.username}</span>
              <Button
                className="hover:text-red-700 text-white font-bold"
                type="link"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button
              className="hover:text-red-700 text-white font-bold"
              type="link"
              icon={<UserOutlined />}
              onClick={openModal}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div
            className={`relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-md ${
              isRegisterMode ? "flip" : ""
            }`}
          >
            {isRegisterMode ? (
              <Register
                setIsModalOpen={setIsModalOpen}
                onRegisterSuccess={() => {
                  setIsRegisterMode(false);
                }}
              />
            ) : (
              <Login
                setIsModalOpen={setIsModalOpen}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
            <button
              onClick={toggleMode}
              className="text-blue-500 hover:text-blue-600 mt-4"
            >
              {isRegisterMode
                ? "Đã có tài khoản? Đăng nhập"
                : "Bạn chưa có tài khoản?"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

Header.defaultProps = {
  onSearch: () => {},
};

export default Header;
