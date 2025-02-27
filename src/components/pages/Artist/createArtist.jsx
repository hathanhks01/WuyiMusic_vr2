import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faCheckCircle,
    faExclamationTriangle,
    faArrowLeft,
    faImage
} from '@fortawesome/free-solid-svg-icons';
import ArtistServices from '../../../Services/ArtistServices';

const CreateArtist = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        artistImage: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState('');

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedDataUrl);
                };
            };
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImageError('');

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setImageError('Kích thước ảnh không được vượt quá 5MB');
                return;
            }

            try {
                const compressedImage = await compressImage(file);
                setFormData(prev => ({
                    ...prev,
                    artistImage: compressedImage
                }));
            } catch (err) {
                setImageError('Có lỗi khi xử lý ảnh. Vui lòng thử lại.');
                console.error('Error processing image:', err);
            }
        }
    };

    const validateStep1 = () => {
        if (!formData.artistImage) {
            setImageError('Vui lòng chọn ảnh nghệ sĩ');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.name.trim() || !formData.bio.trim()) {
            setError('Vui lòng điền đầy đủ thông tin');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setCurrentStep(2);
            setError('');
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setIsLoading(true);
        try {
            await ArtistServices.CreateArtist(formData);
            navigate('/artist');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo thông tin nghệ sĩ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="h-screen flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                            Tạo Nghệ Sĩ Mới
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className={`w-3 h-3 rounded-full ${currentStep === 1 ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                                <span className={`w-3 h-3 rounded-full ${currentStep === 2 ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                            </div>
                            <button
                                onClick={() => navigate('/artist')}
                                className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-4xl mx-auto p-8 h-full flex flex-col">
                        {error && (
                            <div className="mb-6 animate-slideDown bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3" />
                                <div>
                                    <h3 className="text-sm font-semibold text-red-800">Lỗi</h3>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                            {/* Step 1 - Image Upload */}
                            <div className={`flex-1 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                                <div className="h-full flex flex-col">
                                    <div className="flex-1 group relative border-2 border-dashed rounded-3xl hover:border-yellow-500 transition-all 
                                        bg-gray-50/50 hover:bg-amber-50/30 overflow-hidden">
                                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-8">
                                            {formData.artistImage ? (
                                                <>
                                                    <img
                                                        src={formData.artistImage}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-2xl transform transition-transform group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="text-center text-white">
                                                            <FontAwesomeIcon icon={faImage} className="text-3xl mb-2" />
                                                            <p className="font-medium">Thay đổi ảnh</p>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faImage}
                                                        className="text-6xl text-yellow-500 opacity-70 mb-6"
                                                    />
                                                    <p className="text-xl font-medium text-gray-600 mb-2">
                                                        Kéo thả ảnh vào đây
                                                    </p>
                                                    <p className="text-gray-500">hoặc</p>
                                                    <span className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-full 
                                                        hover:bg-yellow-600 transition-colors">
                                                        Chọn từ máy tính
                                                    </span>
                                                    <p className="mt-4 text-sm text-gray-500">Định dạng hỗ trợ: JPG, PNG, JPEG (tối đa 5MB)</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {imageError && (
                                        <div className="mt-4 text-red-500 flex items-center">
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                            {imageError}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Step 2 - Info Form */}
                            <div className={`flex-1 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                                <div className="h-full flex flex-col space-y-8">
                                    <div className="relative group flex-1">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full h-16 px-6 text-xl border-0 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
                                            placeholder="Nhập tên nghệ sĩ"
                                            required
                                        />
                                    </div>

                                    <div className="relative group flex-1">
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full h-48 px-6 py-4 text-lg border-0 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-yellow-500 resize-none placeholder-gray-400"
                                            placeholder="Nhập tiểu sử nghệ sĩ"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Controls */}
                            <div className="mt-8 pt-6 border-t border-gray-200/50">
                                <div className="flex justify-between items-center">
                                    {currentStep === 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => navigate('/artist')}
                                            className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Hủy bỏ
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                                        >
                                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                            Quay lại
                                        </button>
                                    )}

                                    {currentStep === 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={!formData.artistImage}
                                            className={`px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white 
                                                ${!formData.artistImage ? 'opacity-50 cursor-not-allowed' : 'hover:from-amber-500 hover:to-yellow-600'} 
                                                transition-all flex items-center text-lg`}
                                        >
                                            Tiếp tục
                                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white 
                                                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-amber-500 hover:to-yellow-600'} 
                                                transition-all flex items-center text-lg`}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                                    Đang tạo...
                                                </>
                                            ) : (
                                                <>
                                                    Hoàn thành
                                                    <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateArtist;