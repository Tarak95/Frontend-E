import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const userApi = {
  getUsers: async () => {
    return await axios.get(`${BASE_URL}/allusers`);
  },

  getUserById: async (id) => {
    return await axios.get(`${BASE_URL}/singleuser/${id}`);
  },

  updateUser: async (id, userData) => {
    return await axios.post(`${BASE_URL}/update/${id}`, userData);
  },

  deleteUser: async (id) => {
    return await axios.delete(`${BASE_URL}/deleteuser/${id}`);
  }
};