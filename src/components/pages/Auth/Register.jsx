import React, { useState } from 'react';
import authService from '../../../Services/AuthServices';

const Register = ({ setIsModalOpen, onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Regex for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Password validation criteria
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation checks
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ. Vui lòng nhập lại.');
      setIsLoading(false);
      return;
    }

    if (username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username)) {
      setError('Tên người dùng phải dài ít nhất 3 ký tự và chỉ chứa chữ cái và số.');
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt.');
      setIsLoading(false);
      return;
    }

    try {
      // Kiểm tra xem email đã tồn tại hay chưa
      const emailCheckResponse = await authService.checkEmail(email);
      if (!emailCheckResponse.available) {
        setError('Email đã được sử dụng. Vui lòng chọn email khác.');
        setIsLoading(false);
        return;
      }

      // Đăng ký người dùng
      const registerResponse = await authService.register(email, username, password);
      if (registerResponse.success) {
        // Tự động đăng nhập sau khi đăng ký thành công
        const loginResponse = await authService.login(username, password);
        if (loginResponse.success) {
          onRegisterSuccess(); // Gọi callback khi đăng ký thành công
          setIsModalOpen(false);
          // Reset form fields
          setEmail('');
          setUsername('');
          setPassword('');
        } else {
          setError('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
        }
      }
    } catch (error) {
      setError('Đăng ký không thành công. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center font-bold text-2xl mb-4">Đăng ký tài khoản</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        X
      </button>
    </div>
  );
};

export default Register;
