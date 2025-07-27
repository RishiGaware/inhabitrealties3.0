import React, { useEffect, useState, useMemo } from 'react';
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
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import FormModal from '../../components/common/FormModal';
import FloatingInput from '../../components/common/FloatingInput';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { useReferenceSourceContext } from '../../context/ReferenceSourceContext';
import Loader from '../../components/common/Loader';
import CommonAddButton from '../../components/common/Button/CommonAddButton';

const ReferenceSource = () => {
  const [selectedSource, setSelectedSource] = useState(null);
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
  const [sourceToDelete, setSourceToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Get reference source context
  const refSourceContext = useReferenceSourceContext();
  const { referenceSources, getAllReferenceSources, addReferenceSource, updateReferenceSource, removeReferenceSource } = refSourceContext;

  // Memoize filtered sources
  const filteredSources = useMemo(() => {
    let filtered = referenceSources;
    if (searchTerm) {
      filtered = filtered.filter(source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (source.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [referenceSources, searchTerm]);

  useEffect(() => {
    fetchAllSources();
  }, []);

  useEffect(() => {
  }, [referenceSources, filteredSources, searchTerm]);

  const fetchAllSources = async () => {
    setLoading(true);
    try {
      await getAllReferenceSources();
    } catch (error) {
      console.error('ReferenceSource: Fetch error:', error);
      // The context already handles showing error toast
    } finally {
      setLoading(false);
    }
  };

  // Only reset page when filtered results change significantly
  useEffect(() => {
    const maxPage = Math.ceil(filteredSources.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredSources.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredSources.length / pageSize)) {
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
    if (!formData.name?.trim()) {
      newErrors.name = 'Reference source name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }
    if (formData.description && formData.description.trim().length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    setSelectedSource(null);
    setFormData({
      name: '',
      description: '',
      published: true,
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = (source) => {
    setSelectedSource(source);
    const data = {
      name: source.name || '',
      description: source.description || '',
      published: source.published !== undefined ? source.published : true,
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
  };

  const handleDelete = (source) => {
    setSourceToDelete(source);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (sourceToDelete && !isApiCallInProgress) {
      setIsApiCallInProgress(true);
      try {
        await removeReferenceSource(sourceToDelete._id);
        onDeleteClose();
        setSourceToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsApiCallInProgress(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isApiCallInProgress || isSubmitting) {
      return;
    }
    if (!validateForm()) return;
    setIsSubmitting(true);
    setIsApiCallInProgress(true);
    try {
      if (selectedSource) {
        const editData = {
          name: formData.name,
          description: formData.description,
          published: formData.published,
        };
        await updateReferenceSource(selectedSource._id, editData);
      } else {
        const addData = {
          name: formData.name,
          description: formData.description,
        };
        await addReferenceSource(addData);
      }
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedSource(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
    }
  };

  const isFormChanged = () => {
    if (!selectedSource || !originalFormData) return true;
    return (
      formData.name !== originalFormData.name ||
      formData.description !== originalFormData.description ||
      formData.published !== originalFormData.published
    );
  };

  const columns = [
    { key: 'name', label: 'Reference Source Name' },
    { key: 'description', label: 'Description' },
    { 
      key: 'published', 
      label: 'Status', 
      render: (published) => published ? 'Active' : 'Inactive' 
    },
  ];

  const renderRowActions = (source) => (
    <HStack spacing={2}>
      <IconButton
        key="edit"
        aria-label="Edit reference source"
        icon={<EditIcon />}
        size="sm"
        onClick={() => handleEdit(source)}
        colorScheme="brand"
        variant="outline"
      />
      <IconButton
        key="delete"
        aria-label="Delete reference source"
        icon={<DeleteIcon />}
        size="sm"
        onClick={() => handleDelete(source)}
        colorScheme="red"
        variant="outline"
      />
    </HStack>
  );

  return (
    <Box p={5}>
      {/* Loader at the top, non-blocking */}
      {loading && <Loader size="xl" />}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Reference Source
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>
      <Box mb={6} maxW="400px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search reference sources..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </Box>
      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredSources.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!loading ? "No reference sources match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredSources.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredSources.length}
        />
      </TableContainer>

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedSource(null);
          setFormData({
            name: '',
            description: '',
            published: true,
          });
          setOriginalFormData(null);
          setErrors({});
        }}
        title={selectedSource ? 'Edit Reference Source' : 'Add New Reference Source'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedSource ? 'Update' : 'Save'}
        loadingText={selectedSource ? 'Updating...' : 'Saving...'}
        isDisabled={selectedSource ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FloatingInput
              id="name"
              name="name"
              label="Reference Source Name"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={errors.name}
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
        title="Delete Reference Source"
        message={`Are you sure you want to delete the reference source "${sourceToDelete?.name}"?`}
      />
    </Box>
  );
};

export default ReferenceSource; 