import http from '../common/http-common';

const TrackService = {
  GetAllTrack: async () => {
    try {
      const response = await http.get('Track/getAllTrack');
      return response.data;  
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy thông tin bài hát:', error);
      throw error; // Ném lỗi để có thể xử lý bên ngoài
    }
  },
  GetFavoriteTrack: async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const response = await http.get(`Track/Favorite?userId=${userInfo.userId}`);
      return response.data;  
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy thông tin bài hát:', error);
      throw error; 
    }
  }, 
  searchTerm: async (searchTerm) => {
    try {
      const response = await http.get(`Track/searchTerm?searchTerm=${encodeURIComponent(searchTerm)}`);
      return response.data;  
    } catch (error) {
      console.error('Có lỗi xảy ra khi tìm kiếm:', error);
      throw error; 
    }
  },
  addTrackForArtist: async (formData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      if (!userInfo || !userInfo.userId) {
        throw new Error('User not found in localStorage');
      }
      formData.append('ArtistId', userInfo.userId);
      
      const response = await http.post('Track/addtrack', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading track:', error);
      throw error;
    }
  },AddTrack: async (formData) => {
    try {
      const response = await http.post('Track/addtrack', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding track:', error);
      throw error;
    }
  }
  ,updateTrack: async (trackId, formData) => {
    try {
      const response = await http.put(`Track/UpdateTrack/${trackId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating track:', error);
      throw error;
    }
  },DeleteAsync: async (id) => {
    try {
      const response = await http.delete(`Track/${id}`);
      return response.data; 
    } catch (error) {
      console.error('Error deleting track:', error);
      throw error; 
    }
  }
  
};

export default TrackService;
