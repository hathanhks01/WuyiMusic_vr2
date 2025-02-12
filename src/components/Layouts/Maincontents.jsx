// components/Layouts/MainContent.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Discover from '../pages/User/discover';
import LikedList from '../pages/User/LikedList';
import Ranking from '../pages/User/TrackRankingChart';
import SearchComponent from '../pages/User/SearchComponent';

const MainContent = () => {
    return (
        <div className="main-content fixed pt-1 top-14 bottom-16 right-0 w-4/5 h-full bg-[#111727]  overflow-y-auto text-white">
            <Routes>
                <Route path="/" element={<Discover />} /> {/* Trang khởi đầu là Discover */}
                <Route path="/Discover" element={<Discover />} />
                <Route path="/Favorites" element={<LikedList />} />
                <Route path="/Ranking" element={<Ranking />} />
                <Route path='/searchComponenet' element={<SearchComponent />} />           
            </Routes>
            <style>
                {`
                    .main-content::-webkit-scrollbar {
                        display: none; 
                    }

                    .main-content {
                        -ms-overflow-style: none;  
                        scrollbar-width: none; 
                    }
                `}
            </style>
        </div>
    );
};

export default MainContent;
