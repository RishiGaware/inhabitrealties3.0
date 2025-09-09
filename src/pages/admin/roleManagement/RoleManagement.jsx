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
  Badge,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import CommonTable from '../../../components/common/Table/CommonTable';
import CommonPagination from '../../../components/common/pagination/CommonPagination.jsx';
import TableContainer from '../../../components/common/Table/TableContainer';
import FormModal from '../../../components/common/FormModal';
import FloatingInput from '../../../components/common/FloatingInput';
import SearchAndFilter from '../../../components/common/SearchAndFilter';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { useRoleContext } from '../../../context/RoleContext';
import Loader from '../../../components/common/Loader';
import CommonAddButton from '../../../components/common/Button/CommonAddButton';

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState(null);
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
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Get role context
  const roleContext = useRoleContext();
  const { roles, getAllRoles, addRole, updateRole, removeRole, loading } = roleContext;

  // Memoize filtered roles to prevent unnecessary re-renders
  const filteredRoles = useMemo(() => {
    let filtered = roles;
    if (searchTerm) {
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [roles, searchTerm]);

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  // Only reset page when filtered results change significantly
  useEffect(() => {
    const maxPage = Math.ceil(filteredRoles.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredRoles.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredRoles.length / pageSize)) {
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
      newErrors.name = 'Role name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Role name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Role name must be less than 50 characters';
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
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    const data = {
      name: role.name || '',
      description: role.description || '',
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
  };

  const handleDelete = (role) => {
    setRoleToDelete(role);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (roleToDelete && !isApiCallInProgress) {
      setIsApiCallInProgress(true);
      try {
        await removeRole(roleToDelete._id);
        onDeleteClose();
        setRoleToDelete(null);
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
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      if (selectedRole) {
        // Prepare edit data - backend will convert name to uppercase
        const editData = {
          name: formData.name,
          description: formData.description,
        };
        
        await updateRole(selectedRole._id, editData);
      } else {
        // Prepare add data - backend will convert name to uppercase
        const addData = {
          name: formData.name,
          description: formData.description,
        };
        
        await addRole(addData);
      }
      
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedRole(null);
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
    if (!selectedRole || !originalFormData) return true;
    return (
      formData.name !== originalFormData.name ||
      formData.description !== originalFormData.description
    );
  };

  const columns = [
    { 
      key: 'index', 
      label: 'ID',
      render: (value, role) => {
        // Find the index of this role in the filtered data
        const roleIndex = filteredRoles.findIndex(r => r._id === role._id);
        return (
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {roleIndex + 1}
          </Text>
        );
      },
      width: "50px"
    },
    { 
      key: 'name', 
      label: 'Role Name',
      render: (value) => (
        <Text fontWeight="semibold" color="gray.800" noOfLines={1} maxW="120px">
          {value}
        </Text>
      ),
      width: "120px"
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (value) => (
        <Text color="gray.700" noOfLines={1} maxW="200px">
          {value || 'No description'}
        </Text>
      ),
      width: "200px"
    },
    { 
      key: 'published', 
      label: 'Status',
      render: (published) => (
        <Badge colorScheme={published ? 'green' : 'red'} variant="solid" fontSize="xs">
          {published ? 'Active' : 'Inactive'}
        </Badge>
      ),
      width: "80px"
    }
  ];

  // const renderRowActions = (role) => (
  //   <HStack spacing={2}>
  //     <IconButton
  //       key="edit"
  //       aria-label="Edit role"
  //       icon={<EditIcon />}
  //       size="sm"
  //       onClick={() => handleEdit(role)}
  //       colorScheme="brand"
  //       variant="outline"
  //     />
  //     <IconButton
  //       key="delete"
  //       aria-label="Delete role"
  //       icon={<DeleteIcon />}
  //       size="sm"
  //       onClick={() => handleDelete(role)}
  //       colorScheme="red"
  //       variant="outline"
  //     />
  //   </HStack>
  // );


  return (
    <Box p={5}>
      {/* Loader at the top, non-blocking */}
      {loading && (
        <Loader size="xl" />
      )}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Role Management
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>
      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}} // No API search needed for this page
        searchPlaceholder="Search roles..."
        filters={{}}
        onFilterChange={() => {}}
        onApplyFilters={() => {}}
        onClearFilters={() => {}}
        filterOptions={{}}
        title="Filter Roles"
        activeFiltersCount={0}
      />
      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredRoles.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          // rowActions={renderRowActions}
          emptyStateMessage={!loading ? "No roles match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredRoles.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredRoles.length}
        />
      </TableContainer>

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedRole(null);
          setFormData({
            name: '',
            description: '',
          });
          setOriginalFormData(null);
          setErrors({});
        }}
        title={selectedRole ? 'Edit Role' : 'Add New Role'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedRole ? 'Update' : 'Save'}
        loadingText={selectedRole ? 'Updating...' : 'Saving...'}
        isDisabled={selectedRole ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FloatingInput
              id="name"
              name="name"
              label="Role Name"
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
        title="Delete Role"
        message={`Are you sure you want to delete the role "${roleToDelete?.name}"?`}
      />
    </Box>
  );
};

export default RoleManagement; 