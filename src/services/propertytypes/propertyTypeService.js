import api from '../api';
import { PROPERTY_TYPE_ENDPOINTS } from '../apiEndpoints';

// Fetch all property types
export const fetchPropertyTypes = async () => {
  try {
    console.log('propertyTypeService: Fetching all property types');
    const response = await api.get(PROPERTY_TYPE_ENDPOINTS.GET_ALL);
    console.log('propertyTypeService: Fetch property types response:', response.data);
    return response.data;
  } catch (error) {
    console.error('propertyTypeService: Fetch property types error:', error);
    console.error('propertyTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Create a new property type
export const createPropertyType = async (propertyTypeData) => {
  try {
    console.log('propertyTypeService: Creating property type with data:', propertyTypeData);
    console.log('propertyTypeService: Using endpoint:', PROPERTY_TYPE_ENDPOINTS.CREATE);
    
    const response = await api.post(PROPERTY_TYPE_ENDPOINTS.CREATE, propertyTypeData);
    console.log('propertyTypeService: Create property type response:', response);
    console.log('propertyTypeService: Response data:', response.data);
    console.log('propertyTypeService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('propertyTypeService: Create property type error:', error);
    console.error('propertyTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Edit/Update property type
export const editPropertyType = async (id, propertyTypeData) => {
  try {
    console.log('propertyTypeService: Editing property type with ID:', id);
    console.log('propertyTypeService: Edit data:', propertyTypeData);
    console.log('propertyTypeService: Endpoint:', PROPERTY_TYPE_ENDPOINTS.EDIT(id));
    
    const response = await api.put(PROPERTY_TYPE_ENDPOINTS.EDIT(id), propertyTypeData);
    console.log('propertyTypeService: Edit response:', response.data);
    console.log('propertyTypeService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('propertyTypeService: Edit property type error:', error);
    console.error('propertyTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Delete property type (soft delete)
export const deletePropertyType = async (id) => {
  try {
    console.log('propertyTypeService: Deleting property type with ID:', id);
    console.log('propertyTypeService: Endpoint:', PROPERTY_TYPE_ENDPOINTS.DELETE(id));
    
    const response = await api.delete(PROPERTY_TYPE_ENDPOINTS.DELETE(id));
    console.log('propertyTypeService: Delete response:', response.data);
    console.log('propertyTypeService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('propertyTypeService: Delete property type error:', error);
    console.error('propertyTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
}; 