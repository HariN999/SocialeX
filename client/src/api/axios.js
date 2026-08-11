import axios from 'axios';

// Create a configured Axios instance
const axiosInstance = axios.create();

// Add request interceptor to attach the JWT token and route base URL dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:6001';

    if (config.url) {
      if (config.url.startsWith('http://localhost:6001')) {
        config.url = config.url.replace('http://localhost:6001', apiBase);
      } else if (config.url.startsWith('/')) {
        config.url = `${apiBase}${config.url}`;
      }
    }

    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
