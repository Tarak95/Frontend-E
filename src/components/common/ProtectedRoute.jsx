// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import Loader from './Loader';

// export const ProtectedRoute = ({ children, requireAdmin = false }) => {
//   const { user, loading, isAuthenticated, isAdmin } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <Loader fullScreen text="Checking authorization..." />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (requireAdmin && !isAdmin) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;




import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children, adminOnly = false, requireAdmin = false }) => {
  const location = useLocation();

  // LocalStorage থেকে সরাসরি ইউজার ডাটা চেক করা হচ্ছে
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // ১. ইউজার লগইন না থাকলে লগইন পেজে রিডাইরেক্ট করবে
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ২. Admin রাউটের জন্য চেক (adminOnly বা requireAdmin দুটোই সাপোর্ট করবে)
  const needsAdmin = adminOnly || requireAdmin;
  if (needsAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // সব ঠিক থাকলে পেজ দেখাবে
  return children;
};

export default ProtectedRoute;