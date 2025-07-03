import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchUsers, registerUser, editUser, deleteUser } from '../services/usermanagement/userService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// Default context value
const defaultContextValue = {
  users: [],
  loading: false,
  getAllUsers: () => {},
  addUser: () => {},
  updateUser: () => {},
  removeUser: () => {},
};

const UserContext = createContext(defaultContextValue);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUsers();
      console.log('UserContext: Fetch users response:', response);
      
      // Handle the new response format: { message, count, data }
      const usersData = response.data || response;
      setUsers(usersData);
      
    } catch (err) {
      console.error('UserContext: Fetch users error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to fetch users';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view users';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Server error - Please try again later';
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

  const addUser = async (userData) => {
    setLoading(true);
    try {
      const response = await registerUser(userData);
      console.log('UserContext: Add user response:', response);
      
      // Handle the new response format
      const newUser = response.data || {
        ...userData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'User added successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('UserContext: Add user error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to add user';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Invalid data provided - Please check your input';
      } else if (err?.response?.status === 409) {
        errorMessage = 'User with this email already exists';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Validation error - Please check your input data';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      console.log('UserContext: Updating user with ID:', id);
      console.log('UserContext: Update data:', userData);
      
      const response = await editUser(id, userData);
      console.log('UserContext: Update response:', response);
      
      // Update the local state directly instead of fetching all users again
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === id 
            ? { ...user, ...userData, updatedAt: new Date().toISOString() }
            : user
        )
      );
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'User updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('UserContext: Update user error:', err);
      console.error('UserContext: Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        statusText: err?.response?.statusText
      });
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to update user';
      
      if (err?.response?.data?.message) {
        // Use the actual error message from the backend
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        // Some backends return error in 'error' field
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'User not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Invalid data provided - Please check your input';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to update this user';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Validation error - Please check your input data';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Server error - Please try again later';
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

  const removeUser = async (id) => {
    setLoading(true);
    try {
      const response = await deleteUser(id);
      console.log('UserContext: Delete user response:', response);
      
      // Remove the user from local state directly
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'User deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('UserContext: Delete user error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to delete user';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'User not found';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete this user';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    users,
    loading,
    getAllUsers,
    addUser,
    updateUser,
    removeUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}; 