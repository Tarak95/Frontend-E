import axios from 'axios';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from '../utils/constants';

// Initialize localStorage with default dataset if not already present
const initLocalStorage = () => {
  if (!localStorage.getItem('ecobazar_products')) {
    localStorage.setItem('ecobazar_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('ecobazar_users')) {
    localStorage.setItem('ecobazar_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('ecobazar_orders')) {
    localStorage.setItem('ecobazar_orders', JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem('ecobazar_cart')) {
    localStorage.setItem('ecobazar_cart', JSON.stringify([]));
  }
};

initLocalStorage();

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecobazar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
