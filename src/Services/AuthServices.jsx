
import http from "../common/http-common";
import {jwtDecode } from 'jwt-decode';
class AuthService {
  checkEmail = async (email) => {
    try {
      const response = await http.get(`/Auth/CheckEmailExists?email=${email}`);
      return response.data; 
    } catch (error) {
      console.error('Check email error:', error);
      throw this.handleError(error);
    }
  }
    login = async (username, password) => {

        try {
            console.log({ username, password });
            const response = await http.post(`Auth/login?Username=${username}&Password=${password}`);
    
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                const userInfo = {
                  userId: response.data.user.userId,
                  email: response.data.user.email,
                  isPremium: response.data.user.isPremium,
                  username: response.data.user.username,  
              };
              localStorage.setItem('user', JSON.stringify(userInfo));
              
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response.data); // In ra thông tin lỗi
            throw this.handleError(error);
        }
    }
    

  register = async (email, username, password) => {
    try {
      const response = await http.post('/Auth/register', {  // Sửa lại path URL
        email,
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);  // Thêm throw
    }
  }

  // Các phương thức khác giữ nguyên
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }



  getToken = () => {
    return localStorage.getItem('token');
  }

  isAuthenticated = () => {
    return !!this.getToken();
  }

  handleError = (error) => {
    if (error.response) {
      return error.response.data.message || 'Có lỗi xảy ra';
    } else if (error.request) {
      return 'Không nhận được phản hồi từ server';
    } else {
      return 'Lỗi thiết lập request';
    }
  }
  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // Giải mã token để lấy roles
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        user.roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
      }
    }
    return user;
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('admin');
  }
}

const authService = new AuthService();
export default authService;