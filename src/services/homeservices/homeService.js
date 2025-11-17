import api from '../api';

export const submitContactUs = async (payload) => {
    try {
      const response = await api.post('/contactus/create', payload);
      // Also save to inquiries
      try {
        await api.post('/inquiries/create', payload);
      } catch (inquiryError) {
        // Don't fail if inquiry creation fails, just log it
        console.error('Failed to save inquiry:', inquiryError);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };