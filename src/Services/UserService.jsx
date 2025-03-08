import http from '../common/http-common';

const UserServices = {
  GetAllUsers: async () => {
    try {
      const response = await http.get('/Users');
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi lấy danh sách người dùng:', error);
      throw error;
    }
  },

  GetUserById: async (id) => {
    try {
      const response = await http.get(`/Users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Có lỗi xảy ra khi lấy thông tin người dùng ID ${id}:`, error);
      throw error;
    }
  },

  CreateUser: async (userDto) => {
    try {
      const response = await http.post('/Users', userDto);
      return response.data;
    } catch (error) {
      console.error('Có lỗi xảy ra khi tạo người dùng:', error);
      throw error;
    }
  },

  UpdateUser: async (id, userDto) => {
    try {
      const response = await http.put(`/Users/${id}`, userDto);
      return response.data;
    } catch (error) {
      console.error(`Có lỗi xảy ra khi cập nhật người dùng ID ${id}:`, error);
      throw error;
    }
  },

  DeleteUser: async (id) => {
    try {
      const response = await http.delete(`/Users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Có lỗi xảy ra khi xóa người dùng ID ${id}:`, error);
      throw error;
    }
  }
};

export default UserServices;