import http from '../common/http-common';

const QueueServices = {
  CreateQueue: async (userId, currentTrackId) => {
    try {
      const response = await http.get(`/Queue/CreateQueue`, {
        params: {
          userId,
          currentTrackId
        }
      });
      console.log("CreateQueue response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating queue:", error);
      throw error;
    }
  },
  CreateQueueFromAlbumAsync: async (userId, albumId) => {
    try {
      const response = await http.get(`/Queue/CreateQueueFromAlbumAsync`, {
        params: {
          userId,
          albumId
        }
      });
      console.log("CreateQueue response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating queue:", error);
      throw error;
    }
  },

  GetQueueByUserId: async (userId) => {
    try {
      const response = await http.get(`/Queue/GetQueueByUserId`, {
        params: {
          userId
        }
      });
      console.log("GetQueueByUserId response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching queue:", error);
      throw error;
    }
  }
};

export default QueueServices;