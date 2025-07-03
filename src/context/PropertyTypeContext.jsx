import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchPropertyTypes, createPropertyType, editPropertyType, deletePropertyType } from '../services/propertytypes/propertyTypeService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// Default context value
const defaultContextValue = {
  propertyTypes: [],
  loading: false,
  getAllPropertyTypes: () => {},
  addPropertyType: () => {},
  updatePropertyType: () => {},
  removePropertyType: () => {},
};

const PropertyTypeContext = createContext(defaultContextValue);

export const PropertyTypeProvider = ({ children }) => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllPropertyTypes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPropertyTypes();
      console.log('PropertyTypeContext: Fetch property types response:', res);
      // Backend returns: { message: 'all property types', count: 2, data: [...] }
      setPropertyTypes(res.data || []);
    } catch (err) {
      console.error('PropertyTypeContext: Fetch property types error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to fetch property types';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view property types';
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

  const addPropertyType = async (propertyTypeData) => {
    setLoading(true);
    try {
      const response = await createPropertyType(propertyTypeData);
      console.log('PropertyTypeContext: Add property type response:', response);
      
      // Add the new property type to local state directly
      // Backend returns: { message: 'property type added successfully', data: propertyType }
      const newPropertyType = {
        ...propertyTypeData,
        _id: response.data?._id || Date.now().toString(),
        typeName: response.data?.typeName || propertyTypeData.typeName,
        description: response.data?.description || propertyTypeData.description,
        createdAt: response.data?.createdAt || new Date().toISOString(),
        published: response.data?.published !== undefined ? response.data.published : true,
      };
      
      setPropertyTypes(prevPropertyTypes => [...prevPropertyTypes, newPropertyType]);
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Property type added successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('PropertyTypeContext: Add property type error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to add property type';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Property type with this name already exists';
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

  const updatePropertyType = async (id, propertyTypeData) => {
    setLoading(true);
    try {
      console.log('PropertyTypeContext: Updating property type with ID:', id);
      console.log('PropertyTypeContext: Update data:', propertyTypeData);
      
      const response = await editPropertyType(id, propertyTypeData);
      console.log('PropertyTypeContext: Update response:', response);
      
      // Update the local state directly instead of fetching all property types again
      // Backend returns: { message: 'property type updated successfully' } - no data
      setPropertyTypes(prevPropertyTypes => 
        prevPropertyTypes.map(propertyType => 
          propertyType._id === id 
            ? { 
                ...propertyType, 
                typeName: propertyTypeData.typeName,
                description: propertyTypeData.description,
                updatedAt: new Date().toISOString() 
              }
            : propertyType
        )
      );
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Property type updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('PropertyTypeContext: Update property type error:', err);
      console.error('PropertyTypeContext: Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        statusText: err?.response?.statusText
      });
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to update property type';
      
      if (err?.response?.data?.message) {
        // Use the actual error message from the backend
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        // Some backends return error in 'error' field
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Property type not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to update this property type';
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

  const removePropertyType = async (id) => {
    setLoading(true);
    try {
      const response = await deletePropertyType(id);
      console.log('PropertyTypeContext: Delete property type response:', response);
      
      // Remove the property type from local state directly (soft delete)
      // Backend returns: { message: 'property type deleted successfully' } - no data
      setPropertyTypes(prevPropertyTypes => prevPropertyTypes.filter(propertyType => propertyType._id !== id));
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Property type deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('PropertyTypeContext: Delete property type error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to delete property type';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Property type not found';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete this property type';
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
    propertyTypes,
    loading,
    getAllPropertyTypes,
    addPropertyType,
    updatePropertyType,
    removePropertyType,
  };

  return (
    <PropertyTypeContext.Provider value={contextValue}>
      {children}
    </PropertyTypeContext.Provider>
  );
};

export const usePropertyTypeContext = () => {
  const context = useContext(PropertyTypeContext);
  if (context === undefined) {
    throw new Error('usePropertyTypeContext must be used within a PropertyTypeProvider');
  }
  return context;
}; 