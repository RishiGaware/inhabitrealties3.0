import api from '../api';
import { DOCUMENT_ENDPOINTS } from '../apiEndpoints';

// Fetch all documents
export const fetchDocuments = async () => {
  try {
    console.log('documentService: Fetching all documents')
    const response = await api.get(DOCUMENT_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('documentService: Fetch documents error:', error);
    throw error;
  }
};

// Get document by ID (by /api/documents/:id)
export const getDocumentById = async (id) => {
  try {
    const response = await api.get(DOCUMENT_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('documentService: Get by ID error:', error);
    throw error;
  }
};

// Get documents by user ID
export const getDocumentsByUser = async (userId) => {
  try {
    const response = await api.get(DOCUMENT_ENDPOINTS.GET_BY_USER(userId));
    return response.data;
  } catch (error) {
    console.error('documentService: Get by user error:', error);
    throw error;
  }
};

// Get documents by document type ID
export const getDocumentsByType = async (documentTypeId) => {
  try {
    const response = await api.get(DOCUMENT_ENDPOINTS.GET_BY_DOCUMENT_TYPE(documentTypeId));
    return response.data;
  } catch (error) {
    console.error('documentService: Get by type error:', error);
    throw error;
  }
};

// Create a new document
export const createDocument = async (documentData) => {
  try {
    const response = await api.post(
      DOCUMENT_ENDPOINTS.CREATE,
      documentData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('documentService: Create document response:', response.data);
    return response.data;
  } catch (error) {
    console.error('documentService: Create document error:', error);
    throw error;
  }
};

// Edit/Update document
export const editDocument = async (id, documentData) => {
  try {
    const response = await api.put(DOCUMENT_ENDPOINTS.EDIT(id), 
    documentData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
    return response.data;
  } catch (error) {
    console.error('documentService: Edit document error:', error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (id) => {
  try {
    const response = await api.delete(DOCUMENT_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('documentService: Delete document error:', error);
    throw error;
  }
}; 