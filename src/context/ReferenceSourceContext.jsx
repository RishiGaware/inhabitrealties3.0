import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchReferenceSources, createReferenceSource, editReferenceSource, deleteReferenceSource } from '../services/leadmanagement/referenceSourceService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const ReferenceSourceContext = createContext();

export const ReferenceSourceProvider = ({ children }) => {
  const [referenceSources, setReferenceSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllReferenceSources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchReferenceSources();
      // Backend returns: { message: 'all reference sources', count: 2, data: [...] }
      setReferenceSources(res.data || []);
    } catch (err) {
      console.error('ReferenceSourceContext: Fetch error:', err);
      showErrorToast('Failed to fetch reference sources');
      setReferenceSources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addReferenceSource = async (data) => {
    setLoading(true);
    try {
      const res = await createReferenceSource(data);
      // Add the new reference source to local state directly
      // Backend returns: { message: 'reference source added successfully', data: referenceSource }
      const newReferenceSource = {
        ...data,
        _id: res.data?._id || Date.now().toString(),
        name: res.data?.name || data.name,
        description: res.data?.description || data.description,
        createdAt: res.data?.createdAt || new Date().toISOString(),
        published: res.data?.published !== undefined ? res.data.published : true,
      };
      
      setReferenceSources(prev => [...prev, newReferenceSource]);
      showSuccessToast(res.message || 'Reference source added successfully');
    } catch (err) {
      console.error('ReferenceSourceContext: Add error:', err);
      showErrorToast('Failed to add reference source');
    } finally {
      setLoading(false);
    }
  };

  const updateReferenceSource = async (id, data) => {
    setLoading(true);
    try {
      const res = await editReferenceSource(id, data);
      
      // Update the local state directly instead of fetching all reference sources again
      // Backend returns: { message: 'reference source updated successfully' } - no data
      setReferenceSources(prev => prev.map(src => 
        src._id === id 
          ? { 
              ...src, 
              name: data.name,
              description: data.description,
              published: data.published !== undefined ? data.published : src.published,
              updatedAt: new Date().toISOString() 
            }
          : src
      ));
      
      showSuccessToast(res.message || 'Reference source updated successfully');
    } catch (err) {
      console.error('ReferenceSourceContext: Update error:', err);
      showErrorToast('Failed to update reference source');
    } finally {
      setLoading(false);
    }
  };

  const removeReferenceSource = async (id) => {
    setLoading(true);
    try {
      const res = await deleteReferenceSource(id);
      // Remove from local state directly
      setReferenceSources(prev => prev.filter(src => src._id !== id));
      showSuccessToast(res.message || 'Reference source deleted successfully');
    } catch (err) {
      console.error('ReferenceSourceContext: Delete error:', err);
      showErrorToast('Failed to delete reference source');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReferenceSourceContext.Provider value={{
      referenceSources, loading, setReferenceSources,
      getAllReferenceSources, addReferenceSource, updateReferenceSource, removeReferenceSource
    }}>
      {children}
    </ReferenceSourceContext.Provider>
  );
};

export const useReferenceSourceContext = () => useContext(ReferenceSourceContext); 