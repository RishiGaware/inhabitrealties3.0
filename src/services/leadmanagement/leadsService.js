import api from '../api';
import { LEADS_ENDPOINTS } from '../apiEndpoints';

// Fetch all leads
export const fetchLeads = async () => {
  try {
    console.log('leadsService: Fetching all leads');
    const response = await api.get(LEADS_ENDPOINTS.GET_ALL);
    console.log('leadsService: Fetch leads response:', response.data);
    return response.data;
  } catch (error) {
    console.error('leadsService: Fetch leads error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Get lead by ID
export const fetchLeadById = async (id) => {
  try {
    console.log('leadsService: Fetching lead by ID:', id);
    const response = await api.get(LEADS_ENDPOINTS.GET_BY_ID(id));
    console.log('leadsService: Fetch lead by ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('leadsService: Fetch lead by ID error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Create a new lead
export const createLead = async (leadData) => {
  try {
    console.log('leadsService: Creating lead with data:', leadData);
    console.log('leadsService: Using endpoint:', LEADS_ENDPOINTS.CREATE);
    
    const response = await api.post(LEADS_ENDPOINTS.CREATE, leadData);
    console.log('leadsService: Create lead response:', response);
    console.log('leadsService: Response data:', response.data);
    console.log('leadsService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('leadsService: Create lead error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Edit/Update lead
export const editLead = async (id, leadData) => {
  try {
    console.log('leadsService: Editing lead with ID:', id);
    console.log('leadsService: Edit data:', leadData);
    console.log('leadsService: Endpoint:', LEADS_ENDPOINTS.EDIT(id));
    
    const response = await api.put(LEADS_ENDPOINTS.EDIT(id), leadData);
    console.log('leadsService: Edit response:', response.data);
    console.log('leadsService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('leadsService: Edit lead error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Delete lead (soft delete)
export const deleteLead = async (id) => {
  try {
    console.log('leadsService: Deleting lead with ID:', id);
    console.log('leadsService: Endpoint:', LEADS_ENDPOINTS.DELETE(id));
    
    const response = await api.delete(LEADS_ENDPOINTS.DELETE(id));
    console.log('leadsService: Delete response:', response.data);
    console.log('leadsService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('leadsService: Delete lead error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Get all leads with parameters
export const fetchLeadsWithParams = async (params) => {
  try {
    console.log('leadsService: Fetching leads with params:', params);
    console.log('leadsService: Using endpoint:', LEADS_ENDPOINTS.GET_ALL_WITH_PARAMS);
    
    const response = await api.post(LEADS_ENDPOINTS.GET_ALL_WITH_PARAMS, params);
    console.log('leadsService: Fetch leads with params response:', response.data);
    console.log('leadsService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('leadsService: Fetch leads with params error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
}; 