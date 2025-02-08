
import HttpProxy from '../common/http-common';

const FavoriteServices = {
  // Method to add a track to favorites
  Add: async (userId, trackId) => {
    try {
      const response = await HttpProxy.post(`/FavoriteTracks/add?userId=${userId}&trackId=${trackId}`);
      console.log(response.data.message);
      return response.data; // Optionally return the response
    } catch (error) {
      console.error('Error adding track to favorites:', error);
      throw error; // Rethrow error for further handling
    }
  },

  // Method to remove a track from favorites
  Remove: async (userId, trackId) => {
    try {
      const response = await HttpProxy.delete(`/FavoriteTracks/remove?userId=${userId}&trackId=${trackId}`, {
        data: { userId, trackId }
      });
      console.log(response.data.message);
      return response.data; // Optionally return the response
    } catch (error) {
      console.error('Error removing track from favorites:', error);
      throw error; // Rethrow error for further handling
    }
  }
};

export default FavoriteServices;
