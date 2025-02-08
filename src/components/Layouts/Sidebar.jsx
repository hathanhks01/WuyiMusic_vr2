import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isLibraryOpen, setLibraryOpen] = useState(false);

  const toggleLibrary = () => {
    setLibraryOpen(!isLibraryOpen);
  };

  return (
    <div className='fixed pt-3 top-16 left-0 w-1/5 h-full bg-[#111a31] overflow-y-auto'>
      <ul>
        <li className="mb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block p-2 ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/20 hover:text-white'}`
            }
          >
            Khám Phá
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/Ranking"
            className={({ isActive }) =>
              `block p-2 ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/20 hover:text-white'}`
            }
          >
            Chart
          </NavLink>
        </li>
        <li className="mb-2">
          <button
            onClick={toggleLibrary}
            className="block w-full text-left p-2 text-white/80 hover:bg-white/20 hover:text-white"
          >
            Thư viện
          </button>
          {isLibraryOpen && (
            <ul className="ml-4">
              <li className="mb-2">
                <NavLink
                  to="/favorites"  // Absolute path to 'favorites'
                  className={({ isActive }) =>
                    `block p-2 ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/20 hover:text-white'}`
                  }
                >
                  <FontAwesomeIcon icon={faHeartPulse} size="1x" color="white" /> Bài hát đã thích
                </NavLink>
              </li>
              {/* Add more sub-items here if needed */}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
