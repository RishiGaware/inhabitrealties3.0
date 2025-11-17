import api from '../api';

const INQUIRIES_ENDPOINTS = {
  GET_ALL: '/inquiries',
  GET_BY_ID: (id) => `/inquiries/${id}`,
  CREATE: '/inquiries/create',
  UPDATE: (id) => `/inquiries/${id}`,
  DELETE: (id) => `/inquiries/${id}`,
};

export const inquiriesService = {
  // Get all inquiries with optional filters
  getAllInquiries: async (params = {}) => {
    try {
      const response = await api.get(INQUIRIES_ENDPOINTS.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get inquiry by ID
  getInquiryById: async (id) => {
    try {
      const response = await api.get(INQUIRIES_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create inquiry
  createInquiry: async (payload) => {
    try {
      const response = await api.post(INQUIRIES_ENDPOINTS.CREATE, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update inquiry
  updateInquiry: async (id, payload) => {
    try {
      const response = await api.put(INQUIRIES_ENDPOINTS.UPDATE(id), payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete inquiry
  deleteInquiry: async (id) => {
    try {
      const response = await api.delete(INQUIRIES_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

