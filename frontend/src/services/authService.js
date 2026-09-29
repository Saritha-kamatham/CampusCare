import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('campuscare_token', response.data.token);
      localStorage.setItem('campuscare_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async register(data) {
    const response = await api.post('/auth/register', data);
    if (response.data && response.data.token) {
      localStorage.setItem('campuscare_token', response.data.token);
      localStorage.setItem('campuscare_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('campuscare_token');
    localStorage.removeItem('campuscare_user');
  },

  getStoredUser() {
    try {
      const stored = localStorage.getItem('campuscare_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },
};
