import api from '../api';
import { showErrorToast } from '../../utils/toastUtils';

const BASE = '/referancesource';

export const fetchReferenceSources = async () => {
  try {
    const response = await api.get(`${BASE}/`);
    return response.data;
  } catch (error) {
    console.error('referenceSourceService: Fetch reference sources error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to fetch reference sources'
    );
    throw error;
  }
};

export const createReferenceSource = async (data) => {
  try {
    const response = await api.post(`${BASE}/create`, data);
    return response.data;
  } catch (error) {
    console.error('referenceSourceService: Create reference source error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to add reference source'
    );
    throw error;
  }
};

export const editReferenceSource = async (id, data) => {
  try {
    const response = await api.put(`${BASE}/edit/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('referenceSourceService: Edit reference source error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to update reference source'
    );
    throw error;
  }
};

export const deleteReferenceSource = async (id) => {
  try {
    const response = await api.delete(`${BASE}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('referenceSourceService: Delete reference source error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to delete reference source'
    );
    throw error;
  }
}; 