import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Customer Pages
import Home from '../pages/customer/Home';
import ProductListing from '../pages/customer/ProductListing';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import OrderSuccess from '../pages/customer/OrderSuccess';
import OrderFailed from '../pages/customer/OrderFailed';
import MyOrders from '../pages/customer/MyOrders';
import Profile from '../pages/customer/Profile';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import ManageProducts from '../pages/admin/ManageProducts';
import AddProduct from '../pages/admin/AddProduct';
import EditProduct from '../pages/admin/EditProduct';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageOrders from '../pages/admin/ManageOrders';

// Common Pages & Protection
import NotFound from '../pages/common/NotFound';
import ProtectedRoute from '../components/common/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer / Public Storefront Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />

        {/* Protected Customer Routes */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="order-failed" element={<OrderFailed />} />
        <Route
          path="my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 🎯 ১. MainLayout এর ভেতরেও রিসেট পাসওয়ার্ড রুটগুলো সাপোর্ট করানোর জন্য */}
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="resetpassword/:token" element={<ResetPassword />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth Routes with Split-Screen Layout */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        
        {/* 🎯 ২. AuthLayout এর ভেতরেও হাইফেনসহ ও ছাড়া উভয় রুট রাখা হলো */}
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="resetpassword/:token" element={<ResetPassword />} />
        
        <Route path="verify-email/:token" element={<VerifyEmail />} />
        <Route path="verifyemail/:token" element={<VerifyEmail />} />
      </Route>

      {/* Admin Panel Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="products/create" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;