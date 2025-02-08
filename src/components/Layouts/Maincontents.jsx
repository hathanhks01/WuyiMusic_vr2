// components/Layouts/MainContent.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Discover from '../pages/User/discover';
import LikedList from '../pages/User/LikedList';
import Ranking from '../pages/User/TrackRankingChart';
// Thêm các route khác vào đây...

const MainContent = () => {
    return (
        <div className="main-content fixed pt-3 top-16 bottom-16 right-0 w-4/5 h-full bg-[#111727]  overflow-y-auto text-white">
            <Routes>
            <Route path="/" element={<Discover />} /> {/* Trang khởi đầu là Discover */}
                <Route path="/Discover" element={<Discover />} />
                <Route path="/Favorites" element={<LikedList />} />
                <Route path="/Ranking" element={<Ranking />} />
            </Routes>
            <style>
                {`
                    .main-content::-webkit-scrollbar {
                        display: none; /* Ẩn thanh cuộn */
                    }

                    .main-content {
                        -ms-overflow-style: none;  /* Ẩn thanh cuộn cho IE/Edge */
                        scrollbar-width: none; /* Ẩn thanh cuộn cho Firefox */
                    }
                `}
            </style>
        </div>
    );
};

export default MainContent;
