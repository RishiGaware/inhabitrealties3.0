import api from '../api';

export const submitContactUs = async (payload) => {
    try {
      const response = await api.post('/contactus/create', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };