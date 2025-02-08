import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBarAdm from './SideBarAdm';
import MainContentsAdm from './MainContentsAdm';
import RatingAdm from './RatingAdm';
import SuggestionAdm from './SuggestionAdm';
import ArtistAdm from './ArtistAdm';

const Admin = () => {
    return (
        <div className='flex h-screen bg-[#111727]'>
            <SideBarAdm />
            <div className="flex-grow">
                <MainContentsAdm>
                    <Routes>
                        <Route path="/" element={<h1>Admin Statistics</h1>} />
                        <Route path="/rating" element={<RatingAdm />} />
                        <Route path="/suggestion" element={<SuggestionAdm />} /> 
                        <Route path="/artist" element={<ArtistAdm />} />                      
                    </Routes>
                </MainContentsAdm>
            </div>
        </div>
    );
};

export default Admin;