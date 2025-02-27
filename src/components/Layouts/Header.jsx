import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import TrackService from "../../Services/TrackService";

const Header = ({ onSearch = () => {} }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
  });
  const [disableSearch, setDisableSearch] = useState(false);

  const handleArtistClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsModalOpen(true);
      return;
    }
    navigate('/artist');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setDisableSearch(false);
  };

  useEffect(() => {
    if (disableSearch) return;

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

  const handleSearchResultClick = (value) => {
    setSearch(value);
    setSearchResults({ tracks: [], artists: [] });
    setDisableSearch(true);
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
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <button
          onClick={handleArtistClick}
          className="hover:text-red-700 text-white"
        >
          For Artist
        </button>
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
  onSearch: PropTypes.func,
};

export default Header;