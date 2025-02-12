import React from 'react';
import { useLocation } from 'react-router-dom';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useMusic } from '../../pages/PlayerMusicControl/MusicContext';

const SearchComponent = () => {
    const location = useLocation();
    const searchResults = location.state?.searchResults || { tracks: [], artists: [] };
    const { currentTrack, playTrack, isPlaying, playPause } = useMusic();

    const renderTrackSection = () => {
        if (!searchResults.tracks.length) return null;

        return (
            <div className="mb-8" key="tracks-section">
                <h2 className="text-2xl font-bold text-white mb-4">Bài Hát</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.tracks.map((track, index) => (
                        <div
                            key={`track-${track.trackId || index}`}
                            className="flex items-center p-4 rounded-xl bg-[#1a1f32] space-x-4 hover:bg-[#252b44] transition-colors"
                        >
                            <div className="w-16 h-16 flex-shrink-0">
                                <img
                                    src={track.trackImage}
                                    alt={track.title}
                                    className="w-full h-full rounded-md object-cover"
                                    onContextMenu={(e) => e.preventDefault()}
                                    draggable="false"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">
                                    {track.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => {
                                    if (currentTrack?.trackId === track.trackId && isPlaying) {
                                        playPause();
                                    } else {
                                        playTrack(track);
                                    }
                                }}
                                className="text-3xl text-white/80 hover:text-white flex-shrink-0"
                            >
                                {currentTrack?.trackId === track.trackId && isPlaying ? (
                                    <PauseCircleOutlined />
                                ) : (
                                    <PlayCircleOutlined />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderArtistSection = () => {
        if (!searchResults.artists.length) return null;

        return (
            <div key="artists-section">
                <h2 className="text-2xl font-bold text-white mb-4">Nghệ Sĩ</h2>
                <div className="flex gap-8 overflow-x-auto pb-6">
                    {searchResults.artists.map((artist, index) => (
                        <div 
                            key={`artist-${artist.artistId || index}`}
                            className="flex flex-col items-center min-w-[160px] hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={artist.artistImage}
                                alt={artist.name}
                                className="w-40 h-40 rounded-full object-cover"
                                onContextMenu={(e) => e.preventDefault()}
                                draggable="false"
                            />
                            <span className="text-white mt-3 font-medium text-center">
                                {artist.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderNoResults = () => {
        if (searchResults.tracks.length > 0 || searchResults.artists.length > 0) return null;

        return (
            <div className="flex justify-center items-center h-64" key="no-results">
                <span className="text-white text-xl">Không tìm thấy kết quả nào</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen mt-6 mb-16">
            <div className="container mx-auto px-4">
                {renderTrackSection()}
                {renderArtistSection()}
                {renderNoResults()}
            </div>
        </div>
    );
};

export default SearchComponent;