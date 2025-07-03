import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchFollowUpStatuses, fetchFollowUpStatusById, createFollowUpStatus, editFollowUpStatus, deleteFollowUpStatus } from '../services/leadmanagement/followUpStatusService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// Default context value
const defaultContextValue = {
  followUpStatuses: [],
  loading: false,
  getAllFollowUpStatuses: () => {},
  getFollowUpStatusById: () => {},
  addFollowUpStatus: () => {},
  updateFollowUpStatus: () => {},
  removeFollowUpStatus: () => {},
};

const FollowUpStatusContext = createContext(defaultContextValue);

export const FollowUpStatusProvider = ({ children }) => {
  const [followUpStatuses, setFollowUpStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllFollowUpStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFollowUpStatuses();
      console.log('FollowUpStatusContext: Fetch followup statuses response:', res);
      // Backend returns: { message: 'Follow up statuses retrieved successfully', count: 3, data: [...] }
      setFollowUpStatuses(res.data || []);
    } catch (err) {
      console.error('FollowUpStatusContext: Fetch followup statuses error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to fetch followup statuses';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view followup statuses';
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

  const getFollowUpStatusById = async (id) => {
    setLoading(true);
    try {
      const response = await fetchFollowUpStatusById(id);
      console.log('FollowUpStatusContext: Get followup status by ID response:', response);
      return response.data || response;
    } catch (err) {
      console.error('FollowUpStatusContext: Get followup status by ID error:', err);
      
      let errorMessage = 'Failed to fetch followup status';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Followup status not found';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view this followup status';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addFollowUpStatus = async (followUpStatusData) => {
    setLoading(true);
    try {
      const response = await createFollowUpStatus(followUpStatusData);
      console.log('FollowUpStatusContext: Add followup status response:', response);
      
      // Add the new followup status to local state directly
      // Backend returns: { message: 'Follow up status created successfully', data: followUpStatus }
      const newFollowUpStatus = {
        ...followUpStatusData,
        _id: response.data?._id || Date.now().toString(),
        name: response.data?.name || followUpStatusData.name,
        description: response.data?.description || followUpStatusData.description,
        createdAt: response.data?.createdAt || new Date().toISOString(),
        published: response.data?.published !== undefined ? response.data.published : true,
      };
      
      setFollowUpStatuses(prevFollowUpStatuses => [...prevFollowUpStatuses, newFollowUpStatus]);
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Followup status added successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('FollowUpStatusContext: Add followup status error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to add followup status';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Followup status with this name already exists';
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

  const updateFollowUpStatus = async (id, followUpStatusData) => {
    setLoading(true);
    try {
      console.log('FollowUpStatusContext: Updating followup status with ID:', id);
      console.log('FollowUpStatusContext: Update data:', followUpStatusData);
      
      const response = await editFollowUpStatus(id, followUpStatusData);
      console.log('FollowUpStatusContext: Update response:', response);
      
      // Update the local state directly instead of fetching all followup statuses again
      // Backend returns: { message: 'Status updated successfully', data: followUpStatus }
      setFollowUpStatuses(prevFollowUpStatuses => 
        prevFollowUpStatuses.map(followUpStatus => 
          followUpStatus._id === id 
            ? { 
                ...followUpStatus, 
                name: followUpStatusData.name,
                description: followUpStatusData.description,
                published: followUpStatusData.published !== undefined ? followUpStatusData.published : followUpStatus.published,
                updatedAt: new Date().toISOString() 
              }
            : followUpStatus
        )
      );
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Followup status updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('FollowUpStatusContext: Update followup status error:', err);
      console.error('FollowUpStatusContext: Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        statusText: err?.response?.statusText
      });
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to update followup status';
      
      if (err?.response?.data?.message) {
        // Use the actual error message from the backend
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        // Some backends return error in 'error' field
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Followup status not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to update this followup status';
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

  const removeFollowUpStatus = async (id) => {
    setLoading(true);
    try {
      const response = await deleteFollowUpStatus(id);
      console.log('FollowUpStatusContext: Delete followup status response:', response);
      
      // Remove the followup status from local state directly (soft delete)
      // Backend returns: { message: 'Status deleted successfully', data: { _id: '...', published: false } }
      setFollowUpStatuses(prevFollowUpStatuses => prevFollowUpStatuses.filter(followUpStatus => followUpStatus._id !== id));
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Followup status deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('FollowUpStatusContext: Delete followup status error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to delete followup status';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Followup status not found';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete this followup status';
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
    followUpStatuses,
    loading,
    getAllFollowUpStatuses,
    getFollowUpStatusById,
    addFollowUpStatus,
    updateFollowUpStatus,
    removeFollowUpStatus,
  };

  return (
    <FollowUpStatusContext.Provider value={contextValue}>
      {children}
    </FollowUpStatusContext.Provider>
  );
};

export const useFollowUpStatusContext = () => {
  const context = useContext(FollowUpStatusContext);
  if (context === undefined) {
    throw new Error('useFollowUpStatusContext must be used within a FollowUpStatusProvider');
  }
  return context;
}; 