import http from "../common/http-common"; 

const StreamService = {
  // Lấy metadata của track
  getTrackMetadata: async (trackId) => {
    try {
      const response = await http.get(`/Stream/metadata/${trackId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },

  // Phát audio của track
  playAudio: async (trackId) => {
    try {
      const response = await http.get(`/Stream/play/${trackId}`, {
        responseType: 'blob', // Để nhận dữ liệu nhị phân
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },

  // Cập nhật số lần nghe của track
  updateListenCount: async (trackId) => {
    try {
      await http.post(`/Track/updateListenCount/${trackId}`);
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },
};

export default StreamService;
