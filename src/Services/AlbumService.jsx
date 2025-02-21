import http from '../common/http-common';

const AlbumService = {
  createAlbum: async (formData) => {
    const response = await http.post('Album/addAlbum', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getAllAlbums: async () => {
    try {
        const response = await http.get('Album');
        return response;
    } catch (error) {
        console.error('Error fetching albums:', error);
        alert('Đã xảy ra lỗi khi lấy album');
        return []; 
    }
}

};

export default AlbumService;