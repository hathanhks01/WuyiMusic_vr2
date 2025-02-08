import http from "../common/http-common"; // Import http từ http-common
const RatingService = {
     createRating: async (ratingData) => {
          try {
               const response = await http.post('Rating', ratingData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateRating: async (id, ratingData) => {
          try {
              const response = await http.put(`Rating/${id}`, ratingData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     getRatingById: async (id) => {
          try {
               const response = await http.get(`Rating/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     getAllRating: async () => {
          try {
               const response = await http.get('Rating'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default RatingService;