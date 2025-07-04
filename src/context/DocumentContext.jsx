import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  fetchDocuments, 
  createDocument, 
  editDocument, 
  deleteDocument
} from '../services/documents/documentService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// Default context value
const defaultContextValue = {
  documents: [],
  loading: false,
  getAllDocuments: () => {},
  addDocument: () => {},
  updateDocument: () => {},
  removeDocument: () => {},
  getDocumentById: () => {},
  getDocumentsByUser: () => {},
  getDocumentsByType: () => {},
};

const DocumentContext = createContext(defaultContextValue);

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocuments();
      console.log('DocumentContext: Fetch documents response:', res);
      setDocuments(res.data || []);
    } catch (err) {
      console.error('DocumentContext: Fetch documents error:', err);
      
      let errorMessage = 'Failed to fetch documents';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view documents';
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

  const getDocumentById = useCallback(async (id) => {
    try {
      const res = await getDocumentById(id);
      console.log('DocumentContext: Get by ID response:', res);
      return res.data;
    } catch (err) {
      console.error('DocumentContext: Get by ID error:', err);
      showErrorToast('Failed to fetch document');
      throw err;
    }
  }, []);

  const getDocumentsByUser = useCallback(async (userId) => {
    setLoading(true);
    try {
      const res = await getDocumentsByUser(userId);
      console.log('DocumentContext: Get by user response:', res);
      return res.data || [];
    } catch (err) {
      console.error('DocumentContext: Get by user error:', err);
      showErrorToast('Failed to fetch user documents');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentsByType = useCallback(async (documentTypeId) => {
    setLoading(true);
    try {
      const res = await getDocumentsByType(documentTypeId);
      console.log('DocumentContext: Get by type response:', res);
      return res.data || [];
    } catch (err) {
      console.error('DocumentContext: Get by type error:', err);
      showErrorToast('Failed to fetch documents by type');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addDocument = async (documentData) => {
    setLoading(true);
    try {
      const response = await createDocument(documentData);
      console.log('DocumentContext: Add document response:', response);
      
      const newDocument = {
        ...documentData,
        _id: response.data?._id || Date.now().toString(),
        fileName: response.data?.fileName || documentData.fileName,
        originalUrl: response.data?.originalUrl || documentData.originalUrl,
        thumbnailUrl: response.data?.thumbnailUrl || documentData.thumbnailUrl,
        mediumUrl: response.data?.mediumUrl || documentData.mediumUrl,
        displayUrl: response.data?.displayUrl || documentData.displayUrl,
        size: response.data?.size || documentData.size,
        mimeType: response.data?.mimeType || documentData.mimeType,
        createdAt: response.data?.createdAt || new Date().toISOString(),
        published: response.data?.published !== undefined ? response.data.published : true,
      };
      
      setDocuments(prevDocs => [...prevDocs, newDocument]);
      
      const successMessage = response?.message || 'Document added successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('DocumentContext: Add document error:', err);
      
      let errorMessage = 'Failed to add document';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Document with this name already exists';
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

  const updateDocument = async (id, documentData) => {
    setLoading(true);
    try {
      console.log('DocumentContext: Updating document with ID:', id);
      console.log('DocumentContext: Update data:', documentData);
      
      const response = await editDocument(id, documentData);
      console.log('DocumentContext: Update response:', response);
      
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc._id === id 
            ? { 
                ...doc, 
                fileName: documentData.fileName,
                description: documentData.description,
                updatedAt: new Date().toISOString() 
              }
            : doc
        )
      );
      
      const successMessage = response?.message || 'Document updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('DocumentContext: Update document error:', err);
      
      let errorMessage = 'Failed to update document';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Document not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to update this document';
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

  const removeDocument = async (id) => {
    setLoading(true);
    try {
      const response = await deleteDocument(id);
      console.log('DocumentContext: Delete document response:', response);
      
      setDocuments(prevDocs => prevDocs.filter(doc => doc._id !== id));
      
      const successMessage = response?.message || 'Document deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('DocumentContext: Delete document error:', err);
      
      let errorMessage = 'Failed to delete document';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Document not found';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete this document';
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
    documents,
    loading,
    getAllDocuments,
    addDocument,
    updateDocument,
    removeDocument,
    getDocumentById,
    getDocumentsByUser,
    getDocumentsByType,
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
}; 