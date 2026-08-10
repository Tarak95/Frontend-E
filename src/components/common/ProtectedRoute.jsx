import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children, adminOnly = false, requireAdmin = false }) => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const needsAdmin = adminOnly || requireAdmin;
  if (needsAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If everything is in order, the page will be displayed
  return children;
};

export default ProtectedRoute;