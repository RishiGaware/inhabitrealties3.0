import api from '../api';
import { DOCUMENT_TYPE_ENDPOINTS } from '../apiEndpoints';

// Fetch all published document types
export const fetchDocumentTypes = async () => {
  try {
    const response = await api.get(DOCUMENT_TYPE_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('documentTypeService: Fetch document types error:', error);
    console.error('documentTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Fetch all not published document types (admin only)
export const fetchNotPublishedDocumentTypes = async () => {
  try {
    const response = await api.get(DOCUMENT_TYPE_ENDPOINTS.GET_NOT_PUBLISHED);
    return response.data;
  } catch (error) {
    console.error('documentTypeService: Fetch not published error:', error);
    throw error;
  }
};

// Fetch document types with parameters (management only)
export const fetchDocumentTypesWithParams = async (params) => {
  try {
    const response = await api.post(DOCUMENT_TYPE_ENDPOINTS.GET_WITH_PARAMS, params);
    return response.data;
  } catch (error) {
    console.error('documentTypeService: Fetch with params error:', error);
    throw error;
  }
};

// Get document type by ID
export const getDocumentTypeById = async (id) => {
  try {
    const response = await api.get(DOCUMENT_TYPE_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('documentTypeService: Get by ID error:', error);
    throw error;
  }
};

// Create a new document type
export const createDocumentType = async (documentTypeData) => {
  try {
    const response = await api.post(DOCUMENT_TYPE_ENDPOINTS.CREATE, documentTypeData);
    return response.data;
  } catch (error) {
    console.error('documentTypeService: Create document type error:', error);
    throw error;
  }
};

// Edit/Update document type
export const editDocumentType = async (id, documentTypeData) => {
  try {
    const response = await api.put(DOCUMENT_TYPE_ENDPOINTS.EDIT(id), documentTypeData);
    return response.data;
  } catch (error) {
    console.error('documentTypeService: Edit document type error:', error);
    throw error;
  }
};

// Delete document type (soft delete)
export const deleteDocumentType = async (id) => {
  try {
    const response = await api.delete(DOCUMENT_TYPE_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('documentTypeService: Delete document type error:', error);
    throw error;
  }
}; 