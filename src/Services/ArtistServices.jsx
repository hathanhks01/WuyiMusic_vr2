import http from '../common/http-common';

const ArtistServices = {
  GetAllArtist: async () => {
    try {
      const response = await http.get('/Artist'); // Thêm await
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy thông tin nghệ sĩ:', error);
      throw error; 
    }
  },

  GetArtistByUserId: async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userId = user.userId;  
      console.log("User ID:", userId);  // In ra userId để debug
      try {
        const response = await http.get(`/Artist/user/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Có lỗi khi lấy dữ liệu nghệ sĩ:', error);
        throw error;
      }
    } else {
      console.log('User information not found');
      return null;
    }
  },
  CreateArtist: async (artistDto) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      console.log('User information not found');
      return null;
    }
    
    const user = JSON.parse(storedUser);
    const userId = user.userId;

    try {
      // Convert base64 image to File object
      const imageFile = artistDto.artistImage ? 
        await (await fetch(artistDto.artistImage)).blob() : null;

      const formData = new FormData();
      formData.append('Name', artistDto.name);
      formData.append('Bio', artistDto.bio);
      formData.append('userId', userId);
      if (imageFile) {
        formData.append('ArtistImageFile', new File([imageFile], 'artist-image.jpg', { type: 'image/jpeg' }));
      }

      const response = await http.post('/Artist/CreateArtist', formData, {
        params: { userId: userId },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi tạo nghệ sĩ:', error);
      throw error;
    }
  },
  CreateArtistForAdm: async (artistDto) => {
    try {
      const imageFile = artistDto.artistImage ? 
        await (await fetch(artistDto.artistImage)).blob() : null;
      const formData = new FormData();
      formData.append('Name', artistDto.name);
      formData.append('Bio', artistDto.bio);     
      if (imageFile) {
        formData.append('ArtistImageFile', new File([imageFile], 'artist-image.jpg', { type: 'image/jpeg' }));
      }

      const response = await http.post('/Artist/CreateArtistForAdm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi tạo nghệ sĩ:', error);
      throw error;
    }
  }
  ,  GetRamdomArtist: async () => {
    try {
      const response = await http.get('/Artist/random'); // Thêm await
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy thông tin nghệ sĩ:', error);
      throw error; 
    }
  },UpdateArtist: async (artistId, formData) => {
    try {    
      return await http.put(`/Artist/UpdateArtist/${artistId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // THÊM HEADER NÀY
        }
      });
    } catch (error) {
      console.error('Update artist error:', error);
      throw error;
    }
  },DeleteAsync: async (id) => {
    try {
      const response = await http.delete(`Artist/${id}`);
      return response.data; 
    } catch (error) {
      console.error('Error deleting Artist:', error);
      throw error; 
    }
  },
};

export default ArtistServices;
