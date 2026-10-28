import api from '../config/api';

export const issueService = {
  async getIssues(params = {}) {
    const response = await api.get('/issues', { params });
    return response.data;
  },

  async getMyIssues() {
    const response = await api.get('/issues/my');
    return response.data;
  },

  async getOpenIssues() {
    const response = await api.get('/issues/open');
    return response.data;
  },

  async getIssueDetail(id) {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  },

  async createIssue(data) {
    const response = await api.post('/issues', data);
    return response.data;
  },

  async assignIssue(id, staffId, note) {
    const response = await api.post(`/issues/${id}/assign`, { staffId, note });
    return response.data;
  },

  async acceptIssue(id) {
    const response = await api.put(`/issues/${id}/accept`);
    return response.data;
  },

  async claimIssue(id) {
    const response = await api.put(`/issues/${id}/claim`);
    return response.data;
  },

  async updateStatus(id, status, notes = '', resolutionImageUrl = null) {
    const response = await api.put(`/issues/${id}/status`, {
      status,
      notes,
      resolutionImageUrl,
    });
    return response.data;
  },

  async updatePriority(id, priority) {
    const response = await api.put(`/issues/${id}/priority`, null, {
      params: { priority },
    });
    return response.data;
  },

  async getComments(issueId) {
    const response = await api.get(`/issues/${issueId}/comments`);
    return response.data;
  },

  async addComment(issueId, content) {
    const response = await api.post(`/issues/${issueId}/comments`, { content });
    return response.data;
  },

  async uploadImage(imageUri) {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';

    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type === 'image/jpg' ? 'image/jpeg' : type,
    });

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default issueService;
