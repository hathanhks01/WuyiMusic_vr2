import React, { useEffect, useState } from 'react';
import TrackService from '../../../Services/TrackService';
import ArtistServices from '../../../Services/ArtistServices';
import Banner from '../../Layouts/Banner'
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useMusic } from '../PlayerMusicControl/MusicContext';

const Discover = () => {
    const [ListSong, SetListSong] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [artistData, setArtistData] = useState([]);
    const [error, setError] = useState('');
    const { currentTrack, playTrack, isPlaying, playPause, setTracks } = useMusic();
    const fetchTrack = async () => {
        try {
            setIsLoading(true);
            const response = await TrackService.GetAllTrack();
            console.log('Dữ liệu bài hát:', response);  // Kiểm tra dữ liệu trả về
            SetListSong(response);  // Không cần .values
            setTracks(response);
        } catch (error) {
            console.error('Lỗi khi tải bài hát:', error);
            setError('Không thể tải danh sách bài hát');
            SetListSong([]); // Đảm bảo giá trị mặc định nếu lỗi
        } finally {
            setIsLoading(false);
        }
    };
    
    


    useEffect(() => {
        fetchTrack();
    }, []);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await ArtistServices.GetAllArtist();
                console.log("Dữ liệu nghệ sĩ là:", response);
                setArtistData(response);
                startTypingEffect(response.name);
            } catch (err) {
                setError("Có lỗi xảy ra khi lấy dữ liệu nghệ sĩ");
                console.error("Error fetching artist data:", err);
            }
        };

        fetchArtist();
    }, []);
    return (
        <div className="min-h-screen mt-6 mb-16 bg-[#111727]">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-semibold">Gợi ý cho bạn</span>
                    <a className="text-white/80 hover:text-white" href="/#">TẤT CẢ {'>'}</a>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl text-white">Đang tải...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {ListSong.map((track) => (
                            <div
                                key={track.trackId}
                                className="flex items-center p-4 rounded-xl shadow-md bg-[#1a1f32] space-x-4"
                            >
                                <div className="w-16 h-16 object-cover">
                                    <img
                                        src={track.trackImage}
                                        altnp={track.trackName || 'Track Image'}
                                        className="w-full h-full rounded-md"
                                    />
                                </div>
                                <div className="flex-1 text-white">
                                    <span className="block text-sm font-semibold">
                                        {track.title}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        console.log('Đang phát bài hát:', track);
                                        if (currentTrack?.trackId === track.trackId && isPlaying) {
                                            playPause(); // Dừng bài hát nếu đang phát
                                        } else {
                                            if (!track.filePath) {
                                                console.error('Bài hát không có filePath:', track);
                                                return;
                                            }
                                            playTrack(track); // Phát bài hát
                                        }
                                    }}
                                    className="text-3xl text-white/80 hover:text-white transition-transform"
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
                )}

            </div>
            <div className="container mx-auto px-4 pt-3">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-semibold">Nghệ sĩ</span>
                </div>
                <div className="flex justify-between items-center overflow-x-auto">
                    {artistData.map((artist) => (
                        <div key={artist.artistId} className="flex flex-col items-center mx-2">
                            <img
                                src={artist.artistImage || ''}
                                alt={artist.name || 'Artist'}
                                className="object-cover w-28 h-28 rounded-full"
                            />
                            <span className="text-white mt-2 text-center">
                                {artist.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Discover;
