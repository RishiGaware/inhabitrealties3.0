import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchRoles, createRole, editRole, deleteRole } from '../services/rolemanagement/roleService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { demoRoles } from '../data/demoData';

// Default context value
const defaultContextValue = {
  roles: [],
  loading: false,
  getAllRoles: () => {},
  addRole: () => {},
  updateRole: () => {},
  removeRole: () => {},
};

const RoleContext = createContext(defaultContextValue);

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllRoles = useCallback(async () => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demoMode') === 'true';
      if (isDemoMode) {
        setRoles(demoRoles);
        setLoading(false);
        return;
      }
      
      const res = await fetchRoles();
      // Backend returns: { message: 'all roles', count: 2, data: [...] }
      setRoles(res.data || []);
    } catch (err) {
      console.error('RoleContext: Fetch roles error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to fetch roles';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view roles';
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

  const addRole = async (roleData) => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demoMode') === 'true';
      if (isDemoMode) {
        showErrorToast('Demo mode: Cannot add roles. This is a read-only demo.');
        setLoading(false);
        return;
      }
      
      const response = await createRole(roleData);
      // Add the new role to local state directly
      // Backend returns: { message: 'role added successfully', data: role }
      const newRole = {
        ...roleData,
        _id: response.data?._id || Date.now().toString(),
        name: response.data?.name || roleData.name.toUpperCase(),
        description: response.data?.description || roleData.description,
        createdAt: response.data?.createdAt || new Date().toISOString(),
        published: response.data?.published !== undefined ? response.data.published : true,
      };
      
      setRoles(prevRoles => [...prevRoles, newRole]);
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Role added successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('RoleContext: Add role error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to add role';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Role with this name already exists';
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

  const updateRole = async (id, roleData) => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demoMode') === 'true';
      if (isDemoMode) {
        showErrorToast('Demo mode: Cannot update roles. This is a read-only demo.');
        setLoading(false);
        return;
      }
      
      const response = await editRole(id, roleData);
      // Update the local state directly instead of fetching all roles again
      // Backend returns: { message: 'role updated successfully' } - no data
      setRoles(prevRoles => 
        prevRoles.map(role => 
          role._id === id 
            ? { 
                ...role, 
                name: roleData.name.toUpperCase(),
                description: roleData.description,
                updatedAt: new Date().toISOString() 
              }
            : role
        )
      );
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Role updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('RoleContext: Update role error:', err);
      console.error('RoleContext: Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        statusText: err?.response?.statusText
      });
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to update role';
      
      if (err?.response?.data?.message) {
        // Use the actual error message from the backend
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        // Some backends return error in 'error' field
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Role not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to update this role';
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

  const removeRole = async (id) => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demoMode') === 'true';
      if (isDemoMode) {
        showErrorToast('Demo mode: Cannot delete roles. This is a read-only demo.');
        setLoading(false);
        return;
      }
      
      const response = await deleteRole(id);
      // Remove the role from local state directly (soft delete)
      // Backend returns: { message: 'role deleted successfully' } - no data
      setRoles(prevRoles => prevRoles.filter(role => role._id !== id));
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Role deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('RoleContext: Delete role error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to delete role';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Role not found';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete this role';
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
    roles,
    loading,
    getAllRoles,
    addRole,
    updateRole,
    removeRole,
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
}; 