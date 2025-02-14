import http from "../common/http-common"; 

const GenreServices = {
  // Thêm thể loại mới
  addGenre: async (genreData) => {
    try {
      const response = await http.post('Genre', genreData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";             
    }         
  },

  // Lấy tất cả thể loại
  getAllGenres: async () => {
    try {
      const response = await http.get('Genre'); // Gọi API để lấy danh sách thể loại
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },

  // Xóa thể loại theo ID
  deleteGenre: async (id) => {
    try {
      await http.delete(`Genre/${id}`);
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },
};

export default GenreServices;
