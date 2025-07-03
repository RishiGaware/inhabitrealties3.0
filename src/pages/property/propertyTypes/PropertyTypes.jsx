import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  useDisclosure,
  FormControl,
  VStack,
  HStack,
  Text,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Flex,
  Heading,
  Switch,
  FormLabel,
  Image,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CommonTable from '../../../components/common/Table/CommonTable';
import CommonPagination from '../../../components/common/pagination/CommonPagination';
import TableContainer from '../../../components/common/Table/TableContainer';
import FloatingInput from '../../../components/common/FloatingInput';
import FormModal from '../../../components/common/FormModal';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { usePropertyTypeContext } from '../../../context/PropertyTypeContext';
import Loader from '../../../components/common/Loader';
import CommonAddButton from '../../../components/common/Button/CommonAddButton';
import ServerError from '../../../components/common/errors/ServerError';
import NoInternet from '../../../components/common/errors/NoInternet';

const PropertyTypes = () => {
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [propertyTypeToDelete, setPropertyTypeToDelete] = useState(null);
  const [errorType] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Get property type context
  const propertyTypeContext = usePropertyTypeContext();
  const { propertyTypes, getAllPropertyTypes, addPropertyType, updatePropertyType, removePropertyType, loading } = propertyTypeContext;

  // Memoize filtered property types to prevent unnecessary re-renders
  const filteredPropertyTypes = useMemo(() => {
    let filtered = propertyTypes;
    if (searchTerm) {
      filtered = filtered.filter(propertyType =>
        propertyType.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        propertyType.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [propertyTypes, searchTerm]);

  useEffect(() => {
    getAllPropertyTypes();
  }, [getAllPropertyTypes]);

  // Only reset page when filtered results change significantly
  useEffect(() => {
    const maxPage = Math.ceil(filteredPropertyTypes.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredPropertyTypes.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredPropertyTypes.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: newValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.typeName?.trim()) {
      newErrors.typeName = 'Property type name is required';
    } else if (formData.typeName.trim().length < 2) {
      newErrors.typeName = 'Property type name must be at least 2 characters';
    } else if (formData.typeName.trim().length > 50) {
      newErrors.typeName = 'Property type name must be less than 50 characters';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    setSelectedPropertyType(null);
    setFormData({
      typeName: '',
      description: '',
      image: null,
      published: true,
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = (propertyType) => {
    setSelectedPropertyType(propertyType);
    const data = {
      typeName: propertyType.typeName || '',
      description: propertyType.description || '',
      published: propertyType.published !== undefined ? propertyType.published : true,
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
  };

  const handleDelete = (propertyType) => {
    setPropertyTypeToDelete(propertyType);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (propertyTypeToDelete && !isApiCallInProgress) {
      setIsApiCallInProgress(true);
      try {
        await removePropertyType(propertyTypeToDelete._id);
        onDeleteClose();
        setPropertyTypeToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsApiCallInProgress(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple API calls
    if (isApiCallInProgress || isSubmitting) {
      console.log('API call already in progress, ignoring duplicate request');
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      if (selectedPropertyType) {
        // Prepare edit data
        const editData = {
          typeName: formData.typeName,
          description: formData.description,
        };
        
        console.log('Editing property type:', selectedPropertyType._id, 'with data:', editData);
        await updatePropertyType(selectedPropertyType._id, editData);
      } else {
        // Prepare add data
        const addData = {
          typeName: formData.typeName,
          description: formData.description,
        };
        
        console.log('Adding new property type with data:', addData);
        await addPropertyType(addData);
      }
      
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedPropertyType(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      // Don't close the modal on error so user can fix the data
    }
  };

  const resetForm = () => {
    setFormData({
      typeName: '',
      description: '',
      image: null,
      published: true,
    });
    setErrors({});
  };

  const isFormChanged = () => {
    if (!selectedPropertyType || !originalFormData) return true;
    return (
      formData.typeName !== originalFormData.typeName ||
      formData.description !== originalFormData.description ||
      formData.published !== originalFormData.published
    );
  };

  const columns = [
    { key: 'typeName', label: 'Property Type Name' },
    { key: 'description', label: 'Description' },
    { 
      key: 'createdAt', 
      label: 'Created Date', 
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A' 
    },
    { 
      key: 'updatedAt', 
      label: 'Updated Date', 
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A' 
    },
    { 
      key: 'published', 
      label: 'Status', 
      render: (published) => published ? 'Active' : 'Inactive' 
    },
  ];

  const renderRowActions = (propertyType) => (
    <HStack spacing={2}>
      <IconButton
        key="edit"
        aria-label="Edit property type"
        icon={<EditIcon />}
        size="sm"
        onClick={() => handleEdit(propertyType)}
        colorScheme="brand"
        variant="outline"
      />
      <IconButton
        key="delete"
        aria-label="Delete property type"
        icon={<DeleteIcon />}
        size="sm"
        onClick={() => handleDelete(propertyType)}
        colorScheme="red"
        variant="outline"
      />
    </HStack>
  );

  if (errorType === 'network') return <NoInternet onRetry={getAllPropertyTypes} />;
  if (errorType === 'server') return <ServerError onRetry={getAllPropertyTypes} />;

  return (
    <Box p={5}>
      {loading && (
        <Loader size="xl" />
      )}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Property Types
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>

      <Box mb={6} maxW="400px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search property types..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </Box>

      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredPropertyTypes.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage="No property types match your search."
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredPropertyTypes.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredPropertyTypes.length}
        />
      </TableContainer>

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedPropertyType(null);
          resetForm();
        }}
        title={selectedPropertyType ? 'Edit Property Type' : 'Add New Property Type'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedPropertyType ? 'Update' : 'Save'}
        loadingText={selectedPropertyType ? 'Updating...' : 'Saving...'}
        isDisabled={selectedPropertyType ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.typeName}>
            <FloatingInput
              id="typeName"
              name="typeName"
              label="Property Type Name"
              value={formData.typeName || ''}
              onChange={handleInputChange}
              error={errors.typeName}
              maxLength={50}
            />
          </FormControl>
          <FormControl isInvalid={!!errors.description}>
            <FloatingInput
              id="description"
              name="description"
              label="Description"
              value={formData.description || ''}
              onChange={handleInputChange}
              error={errors.description}
              maxLength={200}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="published" mb="0">
              Active Status
            </FormLabel>
            <Switch
              id="published"
              name="published"
              isChecked={formData.published !== undefined ? formData.published : true}
              onChange={handleInputChange}
              colorScheme="brand"
            />
          </FormControl>
        </VStack>
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Property Type"
        message={`Are you sure you want to delete the property type "${propertyTypeToDelete?.typeName}"?`}
      />
    </Box>
  );
};

export default PropertyTypes;