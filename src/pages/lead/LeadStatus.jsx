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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import FormModal from '../../components/common/FormModal';
import FloatingInput from '../../components/common/FloatingInput';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { useLeadStatusContext } from '../../context/LeadStatusContext';
import Loader from '../../components/common/Loader';
import CommonAddButton from '../../components/common/Button/CommonAddButton';

const LeadStatus = () => {
  const [selectedLeadStatus, setSelectedLeadStatus] = useState(null);
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
  const [leadStatusToDelete, setLeadStatusToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Get lead status context
  const leadStatusContext = useLeadStatusContext();
  const { leadStatuses, getAllLeadStatuses, addLeadStatus, updateLeadStatus, removeLeadStatus } = leadStatusContext;

  // Memoize filtered lead statuses to prevent unnecessary re-renders
  const filteredLeadStatuses = useMemo(() => {
    let filtered = leadStatuses;
    if (searchTerm) {
      filtered = filtered.filter(leadStatus =>
        leadStatus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leadStatus.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [leadStatuses, searchTerm]);

  useEffect(() => {
    fetchAllLeadStatuses();
  }, []);

  const fetchAllLeadStatuses = async () => {
    setLoading(true);
    try {
      // Replace with your actual fetch logic
      await getAllLeadStatuses();
    } finally {
      setLoading(false);
    }
  };

  // Only reset page when filtered results change significantly
  useEffect(() => {
    const maxPage = Math.ceil(filteredLeadStatuses.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredLeadStatuses.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredLeadStatuses.length / pageSize)) {
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
      newErrors.name = 'Lead status name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Lead status name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Lead status name must be less than 50 characters';
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
    setSelectedLeadStatus(null);
    setFormData({
      name: '',
      description: '',
      published: true,
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = (leadStatus) => {
    setSelectedLeadStatus(leadStatus);
    const data = {
      name: leadStatus.name || '',
      description: leadStatus.description || '',
      published: leadStatus.published !== undefined ? leadStatus.published : true,
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
  };

  const handleDelete = (leadStatus) => {
    setLeadStatusToDelete(leadStatus);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (leadStatusToDelete && !isApiCallInProgress) {
      setIsApiCallInProgress(true);
      try {
        await removeLeadStatus(leadStatusToDelete._id);
        onDeleteClose();
        setLeadStatusToDelete(null);
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
      if (selectedLeadStatus) {
        // Prepare edit data
        const editData = {
          name: formData.name,
          description: formData.description,
          published: formData.published,
        };
        
        console.log('Editing lead status:', selectedLeadStatus._id, 'with data:', editData);
        await updateLeadStatus(selectedLeadStatus._id, editData);
      } else {
        // Prepare add data
        const addData = {
          name: formData.name,
          description: formData.description,
        };
        
        console.log('Adding new lead status with data:', addData);
        await addLeadStatus(addData);
      }
      
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedLeadStatus(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      // Don't close the modal on error so user can fix the data
    }
  };

  const isFormChanged = () => {
    if (!selectedLeadStatus || !originalFormData) return true;
    return (
      formData.name !== originalFormData.name ||
      formData.description !== originalFormData.description ||
      formData.published !== originalFormData.published
    );
  };

  const columns = [
    { key: 'name', label: 'Lead Status Name' },
    { key: 'description', label: 'Description' },
    { 
      key: 'published', 
      label: 'Status', 
      render: (published) => published ? 'Active' : 'Inactive' 
    },
  ];

  const renderRowActions = (leadStatus) => (
    <HStack spacing={2}>
      <IconButton
        key="edit"
        aria-label="Edit lead status"
        icon={<EditIcon />}
        size="sm"
        onClick={() => handleEdit(leadStatus)}
        colorScheme="brand"
        variant="outline"
      />
      <IconButton
        key="delete"
        aria-label="Delete lead status"
        icon={<DeleteIcon />}
        size="sm"
        onClick={() => handleDelete(leadStatus)}
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
          Lead Status Management
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>
      <Box mb={6} maxW="400px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </Box>
      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredLeadStatuses.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!loading ? "No lead statuses match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredLeadStatuses.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredLeadStatuses.length}
        />
      </TableContainer>

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedLeadStatus(null);
          setFormData({
            name: '',
            description: '',
            published: true,
          });
          setOriginalFormData(null);
          setErrors({});
        }}
        title={selectedLeadStatus ? 'Edit Lead Status' : 'Add New Lead Status'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedLeadStatus ? 'Update' : 'Save'}
        loadingText={selectedLeadStatus ? 'Updating...' : 'Saving...'}
        isDisabled={selectedLeadStatus ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FloatingInput
              id="name"
              name="name"
              label="Lead Status Name"
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
        title="Delete Lead Status"
        message={`Are you sure you want to delete the lead status "${leadStatusToDelete?.name}"?`}
      />
    </Box>
  );
};

export default LeadStatus; 