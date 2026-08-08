import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (credentials) => {
    // Local persistence fallback
    const users = JSON.parse(localStorage.getItem('ecobazar_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (user) {
      const token = `fake-jwt-token-${user.id}-${Date.now()}`;
      localStorage.setItem('ecobazar_token', token);
      localStorage.setItem('ecobazar_user', JSON.stringify(user));
      return { success: true, user, token, message: 'Logged in successfully' };
    } else {
      // Auto-create customer if logging in with new credentials for seamless test
      const newUser = {
        id: `usr-${Date.now()}`,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'customer',
        phone: '+1 555 0199',
        address: '123 Commerce Way, Tech City',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      };
      users.push(newUser);
      localStorage.setItem('ecobazar_users', JSON.stringify(users));
      const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;
      localStorage.setItem('ecobazar_token', token);
      localStorage.setItem('ecobazar_user', JSON.stringify(newUser));
      return { success: true, user: newUser, token, message: 'Logged in successfully' };
    }
  },

  register: async (userData) => {
    const users = JSON.parse(localStorage.getItem('ecobazar_users') || '[]');
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name || userData.fullName || 'New User',
      email: userData.email,
      role: 'customer',
      phone: userData.phone || '',
      address: userData.address || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };

    users.push(newUser);
    localStorage.setItem('ecobazar_users', JSON.stringify(users));
    
    const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem('ecobazar_token', token);
    localStorage.setItem('ecobazar_user', JSON.stringify(newUser));

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
    return { success: true, message: 'Logged out successfully' };
  },

  getCurrentUser: async () => {
    const userStr = localStorage.getItem('ecobazar_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
