import React, { useState } from 'react';
import authService from '../../../Services/AuthServices';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsModalOpen, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await authService.login(username, password);
      if (response.token) {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        onLoginSuccess(userInfo);
        setIsModalOpen(false);
        navigate('/discover');
      }
    } catch (error) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center font-bold text-2xl font-poppins mb-4">
        WuyiMusic
      </h2>
      
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-center">
       
      </div>

      <button
        onClick={() => setIsModalOpen(false)}  // Đóng modal
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        X
      </button>
    </div>
  );
};

export default Login;
