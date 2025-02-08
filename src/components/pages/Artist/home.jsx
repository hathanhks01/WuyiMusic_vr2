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

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await ArtistServices.GetArtistByUserId();
                if (!response || response === null) {
                    console.log("Không tìm thấy nghệ sĩ, chuyển hướng đến trang tạo");
                    navigate('/artist/CreateArtist'); // Sửa lại đường dẫn
                    return;
                }
                console.log("Dữ liệu nghệ sĩ là:", response);
                setArtistData(response);
                startTypingEffect(response.name);
            } catch (err) {
                console.error("Error fetching artist data:", err);
                // Nếu lỗi là do không tìm thấy artist, chuyển hướng đến trang tạo
                if (err.response && err.response.status === 404) {
                    navigate('/artist/CreateArtist'); // Sửa lại đường dẫn
                } else {
                    setError("Có lỗi xảy ra khi lấy dữ liệu nghệ sĩ");
                }
            }
        };

        fetchArtist();
    }, [navigate]);

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
    };

    if (error) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen mt-16 bg-slate-900 flex flex-col items-center">
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
        </div>
    );
};

export default Home;