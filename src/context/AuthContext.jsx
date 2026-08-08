import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
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
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    const newUser = typeof updatedUser === 'object' ? { ...user, ...updatedUser } : updatedUser;
    setUser(newUser);
    localStorage.setItem('ecobazar_user', JSON.stringify(newUser));
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
