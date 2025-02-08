import React from 'react';
import { Profile, Home, ArtistNav, Upload, CreateArtist } from './index'
import { Route, Routes } from 'react-router-dom';
import { MainContentsArtist } from './mainContentsArtist';

const Artist = () => {
    return (
        <div className="h-screen  bg-[#111727]">
            <ArtistNav className="absolute top-0 left-0 w-full h-16  bg-[#111727]" />
            <MainContentsArtist>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/Upload" element={<Upload />} />
                    <Route path="/CreateArtist" element={<CreateArtist />} />
                </Routes>
            </MainContentsArtist>
        </div>
    );
};



export default Artist;
