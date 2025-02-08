import React from 'react';
import './mainContentsArtist.css';
export const MainContentsArtist = ({ children }) => {
    return (
        <div className="w-full h-full flex flex-col overflow-y-auto scrollbar-hide">
            {children}
        </div>
    );
};

