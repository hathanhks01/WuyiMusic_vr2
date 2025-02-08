import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
const SideBarAdm = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-1/5 left-0 flex flex-col h-screen p-0 m-0  bg-[#111727] text-white">
      <div className="pl-18 pt-2 flex justify-center">
        <Link to="/admin" className="text-[30px] text-red-700 font-bold">
          WuyiMusic
        </Link>
      </div>
      <div className="pt-2 flex-grow">
        <ul className="w-full pl-2">
          <li className="mb-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `block p-2 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`
              }
            >
              Thống Kê
            </NavLink>
          </li>
          {/* Dropdown Menu */}
          <li className="mb-2" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
              className="block w-full text-left p-2 text-white/80 hover:bg-white/20 hover:text-white"
            >
              Manager
            </button>
            {isDropdownOpen && (
              <ul className="pl-4">
                <li className="mb-2">
                  <NavLink
                    to="/admin/rating"
                    className={({ isActive }) =>
                      `block p-2 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/20 hover:text-white'
                      }`
                    }
                  >
                    Đánh Giá
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="/admin/suggestion"
                    className={({ isActive }) =>
                      `block p-2 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/20 hover:text-white'
                      }`
                    }
                  >
                    Suggestion
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="/admin/artist"
                    className={({ isActive }) =>
                      `block p-2 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/20 hover:text-white'
                      }`
                    }
                  >
                    Nghệ Sĩ
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBarAdm;