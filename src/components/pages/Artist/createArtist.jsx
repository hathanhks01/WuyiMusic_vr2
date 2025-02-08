import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtistServices from '../../../Services/ArtistServices';

const CreateArtist = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        artistImage: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
            if (file.size > 5 * 1024 * 1024) { // 5MB
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.name.trim() || !formData.bio.trim()) {
            setError('Vui lòng điền đầy đủ thông tin');
            setIsLoading(false);
            return;
        }
    
        try {
            await ArtistServices.CreateArtist({
                name: formData.name,
                bio: formData.bio,
                artistImage: formData.artistImage
            });
            navigate('/artist');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo thông tin nghệ sĩ');
            console.error('Error creating artist:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 pt-20 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-yellow-500">
                    Tạo Thông Tin Nghệ Sĩ
                </h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tên Nghệ Sĩ
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tiểu Sử
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 min-h-32"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Ảnh Nghệ Sĩ
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                        />
                        {imageError && (
                            <div className="mt-2 text-red-500 text-sm">
                                {imageError}
                            </div>
                        )}
                        {formData.artistImage && !imageError && (
                            <div className="mt-2">
                                <img
                                    src={formData.artistImage}
                                    alt="Preview"
                                    className="h-32 w-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 sticky bottom-4 bg-white pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/artist')}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || imageError !== ''}
                            className={`px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors ${
                                (isLoading || imageError !== '') ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Đang Xử Lý...' : 'Tạo Nghệ Sĩ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateArtist;