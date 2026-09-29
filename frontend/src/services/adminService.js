import api from './api';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async createStaff(data) {
    const response = await api.post('/admin/staff', data);
    return response.data;
  },

  async toggleUserActive(id) {
    const response = await api.put(`/admin/users/${id}/toggle-active`);
    return response.data;
  },

  async getStaffList() {
    const response = await api.get('/users/staff');
    return response.data;
  },
};
