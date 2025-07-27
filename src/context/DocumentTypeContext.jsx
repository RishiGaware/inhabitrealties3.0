import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  fetchDocumentTypes, 
  createDocumentType, 
  editDocumentType, 
  deleteDocumentType,
  fetchNotPublishedDocumentTypes,
  fetchDocumentTypesWithParams
} from '../services/documenttypes/documentTypeService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// Default context value
const defaultContextValue = {
  documentTypes: [],
  loading: false,
  getAllDocumentTypes: () => {},
  addDocumentType: () => {},
  updateDocumentType: () => {},
  removeDocumentType: () => {},
  getNotPublishedDocumentTypes: () => {},
  getDocumentTypesWithParams: () => {},
  getDocumentTypeById: () => {},
};

const DocumentTypeContext = createContext(defaultContextValue);

export const DocumentTypeProvider = ({ children }) => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllDocumentTypes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentTypes();
      setDocumentTypes(res.data || []);
    } catch (err) {
      console.error('DocumentTypeContext: Fetch document types error:', err);
      
      let errorMessage = 'Failed to fetch document types';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view document types';
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

  const getNotPublishedDocumentTypes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchNotPublishedDocumentTypes();
      return res.data || [];
    } catch (err) {
      console.error('DocumentTypeContext: Fetch not published error:', err);
      showErrorToast('Failed to fetch unpublished document types');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentTypesWithParams = useCallback(async (params) => {
    setLoading(true);
    try {
      const res = await fetchDocumentTypesWithParams(params);
      return res.data || [];
    } catch (err) {
      console.error('DocumentTypeContext: Fetch with params error:', err);
      showErrorToast('Failed to fetch document types with parameters');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentTypeById = useCallback(async (id) => {
    try {
      const res = await getDocumentTypeById(id);
      return res.data;
    } catch (err) {
      console.error('DocumentTypeContext: Get by ID error:', err);
      showErrorToast('Failed to fetch document type');
      throw err;
    }
  }, []);

  const addDocumentType = async (documentTypeData) => {
    setLoading(true);
    try {
      const response = await createDocumentType(documentTypeData);
      
      const newDocumentType = {
        ...documentTypeData,
        _id: response.data?._id || Date.now().toString(),
        name: response.data?.name || documentTypeData.name.toUpperCase(),
        description: response.data?.description || documentTypeData.description,
        allowedExtensions: response.data?.allowedExtensions || documentTypeData.allowedExtensions,
        maxFileSize: response.data?.maxFileSize || documentTypeData.maxFileSize,
        isRequired: response.data?.isRequired !== undefined ? response.data.isRequired : documentTypeData.isRequired,
        createdAt: response.data?.createdAt || new Date().toISOString(),
        published: response.data?.published !== undefined ? response.data.published : true,
      };
      
      setDocumentTypes(prevTypes => [...prevTypes, newDocumentType]);
      
      const successMessage = response?.message || 'Document type added successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('DocumentTypeContext: Add document type error:', err);
      
      let errorMessage = 'Failed to add document type';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Document type with this name already exists';
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

  const updateDocumentType = async (id, documentTypeData) => {
    setLoading(true);
    try {
      
      const response = await editDocumentType(id, documentTypeData);
      
      setDocumentTypes(prevTypes => 
        prevTypes.map(type => 
          type._id === id 
            ? { 
                ...type, 
                name: documentTypeData.name.toUpperCase(),
                description: documentTypeData.description,
                allowedExtensions: documentTypeData.allowedExtensions,
                maxFileSize: documentTypeData.maxFileSize,
                isRequired: documentTypeData.isRequired,
                updatedAt: new Date().toISOString() 
              }
            : type
        )
      );
      
      const successMessage = response?.message || 'Document type updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('DocumentTypeContext: Update document type error:', err);
      
      let errorMessage = 'Failed to update document type';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Document type not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to update this document type';
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeDocumentType = async (id) => {
    setLoading(true);
    try {
      const response = await deleteDocumentType(id);
      
      setDocumentTypes(prevTypes => prevTypes.filter(type => type._id !== id));
      
      const successMessage = response?.message || 'Document type deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('DocumentTypeContext: Delete document type error:', err);
      
      let errorMessage = 'Failed to delete document type';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Document type not found';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete this document type';
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
    documentTypes,
    loading,
    getAllDocumentTypes,
    addDocumentType,
    updateDocumentType,
    removeDocumentType,
    getNotPublishedDocumentTypes,
    getDocumentTypesWithParams,
    getDocumentTypeById,
  };

  return (
    <DocumentTypeContext.Provider value={contextValue}>
      {children}
    </DocumentTypeContext.Provider>
  );
};

export const useDocumentTypeContext = () => {
  const context = useContext(DocumentTypeContext);
  if (context === undefined) {
    throw new Error('useDocumentTypeContext must be used within a DocumentTypeProvider');
  }
  return context;
}; 