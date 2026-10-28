import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default host address for physical Android phone connected to the same Wi-Fi
export const DEFAULT_API_URL = 'http://192.168.0.135:8080/api';
// Fallback for Android Studio Emulator
export const EMULATOR_API_URL = 'http://10.0.2.2:8080/api';

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Load saved custom server URL if configured by user
AsyncStorage.getItem('custom_api_url').then((savedUrl) => {
  if (savedUrl) {
    api.defaults.baseURL = savedUrl;
  }
}).catch(() => {});

// Attach JWT token to requests automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error reading token from storage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const setCustomApiUrl = async (newUrl) => {
  const cleanUrl = newUrl.replace(/\/+$/, '');
  const fullApiUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  api.defaults.baseURL = fullApiUrl;
  await AsyncStorage.setItem('custom_api_url', fullApiUrl);
  return fullApiUrl;
};

export const getActiveApiUrl = () => api.defaults.baseURL;

export default api;
