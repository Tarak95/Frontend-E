import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (credentials) => {
    const storedUserStr = localStorage.getItem('user') || localStorage.getItem('ecobazar_user');
    
    if (storedUserStr) {
      const user = JSON.parse(storedUserStr);
      const token = `fake-jwt-token-${user._id || user.id}-${Date.now()}`;
      
      localStorage.setItem('ecobazar_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user, token, message: 'Logged in successfully' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: credentials.email.includes('admin') ? 'admin' : 'customer',
      phone: '',
      address: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };

    const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem('ecobazar_token', token);
    localStorage.setItem('user', JSON.stringify(newUser)); 
    return { success: true, user: newUser, token, message: 'Logged in successfully' };
  },

  register: async (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name || userData.fullName || 'New User',
      email: userData.email,
      role: 'customer',
      phone: userData.phone || '',
      address: userData.address || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };

    const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem('ecobazar_token', token);
    localStorage.setItem('user', JSON.stringify(newUser)); 

    return { success: true, user: newUser, token, message: 'Account created successfully!' };
  },

  forgotPassword: async (email) => {
    return { success: true, message: `Password reset instructions sent to ${email}` };
  },

  resetPassword: async ({ token, password }) => {
    return { success: true, message: 'Password has been reset successfully' };
  },

  verifyEmail: async (token) => {
    return { success: true, message: 'Email verified successfully!' };
  },

  resendVerification: async (email) => {
    return { success: true, message: `Verification email sent to ${email}` };
  },

  logout: async () => {
    localStorage.removeItem('ecobazar_token');
    localStorage.removeItem('ecobazar_user');
    localStorage.removeItem('user'); 
    return { success: true, message: 'Logged out successfully' };
  },

  getCurrentUser: async () => {
    const userStr = localStorage.getItem('user') || localStorage.getItem('ecobazar_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};