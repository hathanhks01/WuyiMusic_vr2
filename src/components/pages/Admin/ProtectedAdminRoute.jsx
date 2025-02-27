import { Navigate } from 'react-router-dom';
import authService from '../../../Services/AuthServices';
import {jwtDecode } from 'jwt-decode';
const ProtectedAdminRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!authService.isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;