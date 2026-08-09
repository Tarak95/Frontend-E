import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // ১. আগে LocalStorage থেকে 'user' কী-তে থাকা ডেটা পড়ুন
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // যদি LocalStorage-এ না থাকে তবে API কল করুন
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error loading initial user session:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    setUser(res.user);
    // Login এর সময়েও 'user' key-তেই সেভ করুন
    localStorage.setItem('user', JSON.stringify(res.user));
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    setUser(res.user);
    localStorage.setItem('user', JSON.stringify(res.user));
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem('user'); // Logout এর সময় মুছে দিন
  };

  const updateUserProfile = (updatedUser) => {
    const newUser = typeof updatedUser === 'object' ? { ...user, ...updatedUser } : updatedUser;
    setUser(newUser);
    // 'ecobazar_user' বদলে 'user' দিন
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        updateProfile: updateUserProfile,
        isAdmin,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};