import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtistServices from '../../../Services/ArtistServices';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [artistData, setArtistData] = useState(null);
    const [error, setError] = useState(null);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [typingText, setTypingText] = useState('');

    const startTypingEffect = (name) => {
        const fullText = `For artist ${name}`;
        let index = 0;
        
        const interval = setInterval(() => {
            if (index < fullText.length) {
                setTypingText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
                setIsTypingComplete(true);
            }
        }, 100);

        return () => clearInterval(interval);
    };

    const getRandomTracks = (tracks, num = 6) => {
        if (!tracks || tracks.length === 0) return [];
        const shuffled = [...tracks].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    };

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await ArtistServices.GetArtistByUserId();
                if (!response || response === null) {
                    console.log("Không tìm thấy nghệ sĩ, chuyển hướng đến trang tạo");
                    navigate('/artist/CreateArtist');
                    return;
                }
                console.log("Dữ liệu nghệ sĩ là:", response);
                setArtistData(response);
                startTypingEffect(response.name);
            } catch (err) {
                console.error("Error fetching artist data:", err);
                if (err.response && err.response.status === 404) {
                    navigate('/artist/CreateArtist');
                } else {
                    setError("Có lỗi xảy ra khi lấy dữ liệu nghệ sĩ");
                }
            }
        };

        fetchArtist();
    }, [navigate]);

    if (!artistData) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    const randomTracks = getRandomTracks(artistData.tracks);

    return (
        <div className="h-screen w-screen mt-16 bg-slate-900 flex flex-col items-center relative">
            {/* Header section - vị trí cố định */}
            <div className="flex items-center mt-12 space-x-12">
                <div className="text-center mr-8">
                    <h2 className="text-yellow-300 text-2xl">
                        WuyiMusic xin chào
                    </h2>
                    <h1 className="text-white text-3xl flex items-center">
                        {typingText}
                        <span className="cursor"></span>
                    </h1>
                </div>

                {artistData && (
                    <div className="h-80 w-80 rounded-full overflow-hidden border-2 border-yellow-400 shadow-custom animate-flyin">
                        <img
                            src={artistData.artistImage || ''}
                            alt="Artist"
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
            </div>

            {/* Khối cube thứ nhất - bên dưới header bên trái */}
            {randomTracks.length === 6 && (
                <div className="absolute left-20 top-[32rem] h-auto w-auto">
                    <div className="content-wrapper">
                        <div className="content">
                            {randomTracks.map((track, index) => (
                                <img
                                    key={index}
                                    src={track.trackImage}
                                    alt={`Track ${index + 1}`}
                                    className='object-cover'
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Khối cube thứ hai - bên dưới cube thứ nhất và bên phải */}
            {randomTracks.length === 6 && (
                <div className="absolute right-20 top-[48rem] h-auto w-auto">
                    <div className="content-wrapper">
                        <div className="content">
                            {randomTracks.map((track, index) => (
                                <img
                                    key={index}
                                    src={track.trackImage}
                                    alt={`Track ${index + 1}`}
                                    className='object-cover'
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;