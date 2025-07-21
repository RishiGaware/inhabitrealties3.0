import { useState, useEffect, useMemo } from 'react';
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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import CommonTable from '../../../components/common/Table/CommonTable';
import CommonPagination from '../../../components/common/pagination/CommonPagination.jsx';
import TableContainer from '../../../components/common/Table/TableContainer';
import FormModal from '../../../components/common/FormModal';
import FloatingInput from '../../../components/common/FloatingInput';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { useDocumentTypeContext } from '../../../context/DocumentTypeContext';
import Loader from '../../../components/common/Loader';
import CommonAddButton from '../../../components/common/Button/CommonAddButton';

const DocumentTypeManagement = () => {
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
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
  const [documentTypeToDelete, setDocumentTypeToDelete] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Get document type context
  const documentTypeContext = useDocumentTypeContext();
  const { documentTypes, getAllDocumentTypes, addDocumentType, updateDocumentType, removeDocumentType, loading } = documentTypeContext;

  // Memoize filtered document types to prevent unnecessary re-renders
  const filteredDocumentTypes = useMemo(() => {
    let filtered = documentTypes;
    if (searchTerm) {
      filtered = filtered.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [documentTypes, searchTerm]);

  useEffect(() => {
    getAllDocumentTypes();
  }, [getAllDocumentTypes]);

  // Only reset page when filtered results change significantly
  useEffect(() => {
    const maxPage = Math.ceil(filteredDocumentTypes.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredDocumentTypes.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredDocumentTypes.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Document type name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Document type name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Document type name must be less than 50 characters';
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
    setSelectedDocumentType(null);
    setFormData({
      name: '',
      description: '',
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = (documentType) => {
    setSelectedDocumentType(documentType);
    const data = {
      name: documentType.name || '',
      description: documentType.description || '',
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
  };

  const handleDelete = (documentType) => {
    setDocumentTypeToDelete(documentType);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (documentTypeToDelete && !isApiCallInProgress && !isDeleteLoading) {
      setIsApiCallInProgress(true);
      setIsDeleteLoading(true);
      try {
        await removeDocumentType(documentTypeToDelete._id);
        onDeleteClose();
        setDocumentTypeToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsApiCallInProgress(false);
        setIsDeleteLoading(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isApiCallInProgress || isSubmitting) {
      console.log('API call already in progress, ignoring duplicate request');
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      if (selectedDocumentType) {
        const editData = {
          name: formData.name,
          description: formData.description,
        };
        
        console.log('Editing document type:', selectedDocumentType._id, 'with data:', editData);
        await updateDocumentType(selectedDocumentType._id, editData);
      } else {
        const addData = {
          name: formData.name,
          description: formData.description,
        };
        
        console.log('Adding new document type with data:', addData);
        await addDocumentType(addData);
      }
      
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedDocumentType(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
    }
  };

  const isFormChanged = () => {
    if (!selectedDocumentType || !originalFormData) return true;
    return (
      formData.name !== originalFormData.name ||
      formData.description !== originalFormData.description
    );
  };

  const columns = [
    { key: 'name', label: 'Document Type Name' },
    { key: 'description', label: 'Description' },
    { key: 'published', label: 'Status', render: (published) => (
      <Text color={published ? 'green.500' : 'red.500'} fontWeight="medium">
        {published ? 'Active' : 'Inactive'}
      </Text>
    )},
  ];

  const renderRowActions = (documentType) => (
    <HStack spacing={2}>
      <IconButton
        key="edit"
        aria-label="Edit document type"
        icon={<EditIcon />}
        size="sm"
        onClick={() => handleEdit(documentType)}
        colorScheme="brand"
        variant="outline"
      />
      <IconButton
        key="delete"
        aria-label="Delete document type"
        icon={<DeleteIcon />}
        size="sm"
        onClick={() => handleDelete(documentType)}
        colorScheme="red"
        variant="outline"
      />
    </HStack>
  );

  return (
    <Box p={5}>
      {loading && (
        <Loader size="xl" />
      )}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Document Type Management
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>
      <Box mb={6} maxW="400px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search document types..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </Box>
      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredDocumentTypes.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!loading ? "No document types match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredDocumentTypes.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredDocumentTypes.length}
        />
      </TableContainer>

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedDocumentType(null);
          setFormData({
            name: '',
            description: '',
          });
          setOriginalFormData(null);
          setErrors({});
        }}
        title={selectedDocumentType ? 'Edit Document Type' : 'Add New Document Type'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedDocumentType ? 'Update' : 'Save'}
        loadingText={selectedDocumentType ? 'Updating...' : 'Saving...'}
        isDisabled={selectedDocumentType ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FloatingInput
              id="name"
              name="name"
              label="Document Type Name"
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
        </VStack>
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Document Type"
        message={`Are you sure you want to delete the document type "${documentTypeToDelete?.name}"?`}
        isLoading={isDeleteLoading}
        loadingText="Deleting..."
      />
    </Box>
  );
};

export default DocumentTypeManagement; 