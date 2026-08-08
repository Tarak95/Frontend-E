export const userApi = {
  getUsers: async () => {
    const users = JSON.parse(localStorage.getItem('ecobazar_users') || '[]');
    return { success: true, data: users };
  },

  getUserById: async (id) => {
    const users = JSON.parse(localStorage.getItem('ecobazar_users') || '[]');
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { success: true, data: user };
  },

  updateUser: async (id, userData) => {
    const users = JSON.parse(localStorage.getItem('ecobazar_users') || '[]');
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    users[index] = { ...users[index], ...userData };
    localStorage.setItem('ecobazar_users', JSON.stringify(users));

    // Update current logged in user if updating self
    const current = JSON.parse(localStorage.getItem('ecobazar_user') || '{}');
    if (current.id === id) {
      localStorage.setItem('ecobazar_user', JSON.stringify(users[index]));
    }

    return { success: true, data: users[index], message: 'User updated successfully' };
  },

  deleteUser: async (id) => {
    let users = JSON.parse(localStorage.getItem('ecobazar_users') || '[]');
    users = users.filter(u => u.id !== id);
    localStorage.setItem('ecobazar_users', JSON.stringify(users));
    return { success: true, message: 'User deleted successfully' };
  }
};
