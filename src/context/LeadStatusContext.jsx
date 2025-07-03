import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchLeadStatuses, fetchLeadStatusById, createLeadStatus, editLeadStatus, deleteLeadStatus } from '../services/leadmanagement/leadStatusService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// Default context value
const defaultContextValue = {
  leadStatuses: [],
  loading: false,
  getAllLeadStatuses: () => {},
  getLeadStatusById: () => {},
  addLeadStatus: () => {},
  updateLeadStatus: () => {},
  removeLeadStatus: () => {},
};

const LeadStatusContext = createContext(defaultContextValue);

export const LeadStatusProvider = ({ children }) => {
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllLeadStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchLeadStatuses();
      console.log('LeadStatusContext: Fetch lead statuses response:', res);
      // Backend returns: { message: 'all lead statuses', count: 2, data: [...] }
      setLeadStatuses(res.data || []);
    } catch (err) {
      console.error('LeadStatusContext: Fetch lead statuses error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to fetch lead statuses';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view lead statuses';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      } else if (err?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error - Please check your connection';
      } else if (err?.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - Please try again';
      }
      
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLeadStatusById = async (id) => {
    setLoading(true);
    try {
      const response = await fetchLeadStatusById(id);
      console.log('LeadStatusContext: Get lead status by ID response:', response);
      return response.data || response;
    } catch (err) {
      console.error('LeadStatusContext: Get lead status by ID error:', err);
      
      let errorMessage = 'Failed to fetch lead status';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Lead status not found';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view this lead status';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addLeadStatus = async (leadStatusData) => {
    setLoading(true);
    try {
      const response = await createLeadStatus(leadStatusData);
      console.log('LeadStatusContext: Add lead status response:', response);
      
      // Add the new lead status to local state directly
      // Backend returns: { message: 'lead status added successfully', data: leadStatus }
      const newLeadStatus = {
        ...leadStatusData,
        _id: response.data?._id || Date.now().toString(),
        name: response.data?.name || leadStatusData.name,
        description: response.data?.description || leadStatusData.description,
        createdAt: response.data?.createdAt || new Date().toISOString(),
        published: response.data?.published !== undefined ? response.data.published : true,
      };
      
      setLeadStatuses(prevLeadStatuses => [...prevLeadStatuses, newLeadStatus]);
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Lead status added successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('LeadStatusContext: Add lead status error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to add lead status';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Lead status with this name already exists';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Validation error - Please check your input data';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id, leadStatusData) => {
    setLoading(true);
    try {
      console.log('LeadStatusContext: Updating lead status with ID:', id);
      console.log('LeadStatusContext: Update data:', leadStatusData);
      
      const response = await editLeadStatus(id, leadStatusData);
      console.log('LeadStatusContext: Update response:', response);
      
      // Update the local state directly instead of fetching all lead statuses again
      // Backend returns: { message: 'lead status updated successfully' } - no data
      setLeadStatuses(prevLeadStatuses => 
        prevLeadStatuses.map(leadStatus => 
          leadStatus._id === id 
            ? { 
                ...leadStatus, 
                name: leadStatusData.name,
                description: leadStatusData.description,
                published: leadStatusData.published !== undefined ? leadStatusData.published : leadStatus.published,
                updatedAt: new Date().toISOString() 
              }
            : leadStatus
        )
      );
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Lead status updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('LeadStatusContext: Update lead status error:', err);
      console.error('LeadStatusContext: Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        statusText: err?.response?.statusText
      });
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to update lead status';
      
      if (err?.response?.data?.message) {
        // Use the actual error message from the backend
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        // Some backends return error in 'error' field
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Lead status not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to update this lead status';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Validation error - Please check your input data';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      } else if (err?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error - Please check your connection';
      } else if (err?.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - Please try again';
      }
      
      showErrorToast(errorMessage);
      throw err; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  const removeLeadStatus = async (id) => {
    setLoading(true);
    try {
      const response = await deleteLeadStatus(id);
      console.log('LeadStatusContext: Delete lead status response:', response);
      
      // Remove the lead status from local state directly (soft delete)
      // Backend returns: { message: 'lead status deleted successfully' } - no data
      setLeadStatuses(prevLeadStatuses => prevLeadStatuses.filter(leadStatus => leadStatus._id !== id));
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Lead status deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('LeadStatusContext: Delete lead status error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to delete lead status';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Lead status not found';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete this lead status';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    leadStatuses,
    loading,
    getAllLeadStatuses,
    getLeadStatusById,
    addLeadStatus,
    updateLeadStatus,
    removeLeadStatus,
  };

  return (
    <LeadStatusContext.Provider value={contextValue}>
      {children}
    </LeadStatusContext.Provider>
  );
};

export const useLeadStatusContext = () => {
  const context = useContext(LeadStatusContext);
  if (context === undefined) {
    throw new Error('useLeadStatusContext must be used within a LeadStatusProvider');
  }
  return context;
}; 