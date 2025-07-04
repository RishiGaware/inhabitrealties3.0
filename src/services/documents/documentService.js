import api from '../api';
import { DOCUMENT_ENDPOINTS } from '../apiEndpoints';

// Fetch all documents
export const fetchDocuments = async () => {
  try {
    console.log('documentService: Fetching all documents');
    const response = await api.get(DOCUMENT_ENDPOINTS.GET_ALL);
    console.log('documentService: Fetch documents response:', response.data);
    return response.data;
  } catch (error) {
    console.error('documentService: Fetch documents error:', error);
    throw error;
  }
};

// Get document by ID
export const getDocumentById = async (id) => {
  try {
    console.log('documentService: Fetching document by ID:', id);
    const response = await api.get(DOCUMENT_ENDPOINTS.GET_BY_ID(id));
    console.log('documentService: Get by ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('documentService: Get by ID error:', error);
    throw error;
  }
};

// Get documents by user ID
export const getDocumentsByUser = async (userId) => {
  try {
    console.log('documentService: Fetching documents for user:', userId);
    const response = await api.get(DOCUMENT_ENDPOINTS.GET_BY_USER(userId));
    console.log('documentService: Get by user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('documentService: Get by user error:', error);
    throw error;
  }
};

// Get documents by document type ID
export const getDocumentsByType = async (documentTypeId) => {
  try {
    console.log('documentService: Fetching documents by type:', documentTypeId);
    const response = await api.get(DOCUMENT_ENDPOINTS.GET_BY_DOCUMENT_TYPE(documentTypeId));
    console.log('documentService: Get by type response:', response.data);
    return response.data;
  } catch (error) {
    console.error('documentService: Get by type error:', error);
    throw error;
  }
};

// Create a new document
export const createDocument = async (documentData) => {
  try {
    console.log('documentService: Creating document with data:', documentData);
    const response = await api.post(DOCUMENT_ENDPOINTS.CREATE, documentData);
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
    console.log('documentService: Editing document with ID:', id);
    console.log('documentService: Edit data:', documentData);
    const response = await api.put(DOCUMENT_ENDPOINTS.EDIT(id), documentData);
    console.log('documentService: Edit response:', response.data);
    return response.data;
  } catch (error) {
    console.error('documentService: Edit document error:', error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (id) => {
  try {
    console.log('documentService: Deleting document with ID:', id);
    const response = await api.delete(DOCUMENT_ENDPOINTS.DELETE(id));
    console.log('documentService: Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('documentService: Delete document error:', error);
    throw error;
  }
}; 