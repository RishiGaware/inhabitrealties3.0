import api from '../api';

export const submitContactUs = async (payload) => {
    try {
      // Submit to contact us endpoint
      const response = await api.post('/contactus/create', payload);
      
      // Also create a lead from contact form (not inquiry)
      try {
        console.log('Creating lead from contact form:', payload);
        const leadResponse = await api.post('/leads/create-from-contact', payload);
        console.log('Lead created successfully:', leadResponse.data);
      } catch (leadError) {
        // Log detailed error information
        console.error('Failed to save lead:', leadError);
        console.error('Lead error response:', leadError.response?.data);
        console.error('Lead error status:', leadError.response?.status);
        // Don't fail the entire request if lead creation fails
        // but log it for debugging
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };