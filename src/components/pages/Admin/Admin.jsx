import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBarAdm from './SideBarAdm';
import MainContentsAdm from './MainContentsAdm';
import RatingAdm from './RatingAdm';
import SuggestionAdm from './SuggestionAdm';
import GenreManager from './GenreManager';
import { Statistics, TrackManager, ArtistManager } from './index'

const Admin = () => {
    return (
        <div className="h-screen flex bg-[#111727] overflow-hidden">
            {/* Sidebar 1/5 width */}
            <div className="w-1/5 h-full overflow-hidden">
                <SideBarAdm />
            </div>

            {/* Main Content 4/5 width */}
            <div className="w-4/5 h-full overflow-hidden">
                <MainContentsAdm>
                    <Routes>
                        <Route path="/" element={<Statistics />} />
                        <Route path="/rating" element={<RatingAdm />} />
                        <Route path="/suggestion" element={<SuggestionAdm />} />
                        <Route path="/artist" element={<ArtistManager />} />
                        <Route path="/Genre" element={<GenreManager />} />
                        <Route path="/ManagerTrack" element={<TrackManager />} />
                    </Routes>
                </MainContentsAdm>
            </div>
        </div>
    );
};

export default Admin;
