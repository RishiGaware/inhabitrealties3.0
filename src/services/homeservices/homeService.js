import api from '../api';

export const submitContactUs = async (payload) => {
    try {
      // Submit to contact us endpoint
      const response = await api.post('/contactus/create', payload);
      
      // Also create a lead from contact form (not inquiry)
      try {
        const leadResponse = await api.post('/leads/create-from-contact', payload);
      } catch (leadError) {
        // Log detailed error information
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };