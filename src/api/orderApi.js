import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const orderApi = {
  // ব্যাকএন্ডের app.get('/getorders/:userid') এ কল পাঠাবে
  getAllOrders: async (userId = 'all') => {
    return await axios.get(`${BASE_URL}/getorders/${userId}`);
  },

  createOrder: async (orderData) => {
    return await axios.post(`${BASE_URL}/payment`, orderData);
  }
};