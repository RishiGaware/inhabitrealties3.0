import { useEffect, useState, useMemo } from 'react';
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
  Select,
  Flex,
  Heading,
  Switch,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import CommonTable from '../../../components/common/Table/CommonTable';
import CommonPagination from '../../../components/common/pagination/CommonPagination';
import TableContainer from '../../../components/common/Table/TableContainer';
import FormModal from '../../../components/common/FormModal';
import FloatingInput from '../../../components/common/FloatingInput';
import SearchableSelect from '../../../components/common/SearchableSelect';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { useUserContext } from '../../../context/UserContext';
import { fetchRoles } from '../../../services/rolemanagement/roleService';
import Loader from '../../../components/common/Loader';
import CommonAddButton from '../../../components/common/Button/CommonAddButton';

const UserManagement = () => {
  // All hooks must be called at the top level
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Get user context
  const userContext = useUserContext();
  const { users, getAllUsers, addUser, updateUser, removeUser } = userContext;

  // Convert roles to options for dropdown - display name but use _id as value
  const roleOptions = useMemo(() => {
    return roles.map(role => ({
      value: role._id,        // Use _id as value (this will be sent in payload)
      label: role.name        // Use name as label (this will be displayed)
    }));
  }, [roles]);

  // Helper function to get role label from value (for table display)
  const getRoleLabel = (roleValue) => {
    const role = roleOptions.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  // Fetch roles from API
  const getAllRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await fetchRoles();
      
      // Handle the response format: { message, count, data }
      const rolesData = response.data || response;
      setRoles(rolesData);
      
    } catch (error) {
      console.error('UserManagement: Fetch roles error:', error);
    } finally {
      setRolesLoading(false);
    }
  };

  // Memoize filtered users to prevent unnecessary re-renders
  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    return filtered;
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      await getAllUsers();
      await getAllRoles();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Only reset page when filtered results change significantly
  useEffect(() => {
    const maxPage = Math.ceil(filteredUsers.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: '',
      password: '',
      confirmPassword: '',
      published: true,
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    const data = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || '', // This should be the role ID
      published: user.published !== undefined ? user.published : true,
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (userToDelete && !isApiCallInProgress && !isDeleteLoading) {
      setIsApiCallInProgress(true);
      setIsDeleteLoading(true);
      try {
        await removeUser(userToDelete._id);
        onDeleteClose();
        setUserToDelete(null);
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
    // Prevent multiple API calls
    if (isApiCallInProgress || isSubmitting) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setIsApiCallInProgress(true);
    
    try {
      if (selectedUser) {
        // Prepare edit data with all necessary fields
        const editData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role, // This will be the role ID (e.g., "68162f63ff2da55b40ca61b8")
          published: formData.published !== undefined ? formData.published : true,
        };
        
        // Add password only if provided
        if (formData.password) {
          editData.password = formData.password;
        }
        
        const result = await updateUser(selectedUser._id, editData);
      } else {
        // Prepare add data
        const addData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role, // This will be the role ID (e.g., "68162f63ff2da55b40ca61b8")
          password: formData.password,
          published: formData.published !== undefined ? formData.published : true,
        };
        
        const result = await addUser(addData);
      }
      
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedUser(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      // Don't close the modal on error so user can fix the data
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Essential validations only
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone number validation - 10 digits only
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
      }
    }
    
    if (!formData.role?.trim()) {
      newErrors.role = 'Role is required';
    }
    
    // Password validation (only for new users)
    if (!selectedUser) {
      if (!formData.password?.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword?.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Special handling for phone number formatting
    if (name === 'phoneNumber') {
      // Remove all non-digit characters and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, '');
      newValue = digitsOnly.slice(0, 10);
    }
    
    setFormData({ ...formData, [name]: newValue });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRoleChange = (roleId) => {
    setFormData({ ...formData, role: roleId });
    if (errors.role) {
      setErrors({ ...errors, role: '' });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredUsers.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (_, row) => `${row.firstName} ${row.lastName}` },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'role', label: 'Role', render: (role) => getRoleLabel(role) },
    { key: 'published', label: 'Status', render: (s) => (s ? 'Active' : 'Inactive') },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <Flex>
          <IconButton
            key="edit"
            icon={<EditIcon />}
            variant="outline"
            colorScheme="brand"
            aria-label="Edit user"
            mr={2}
            onClick={() => handleEdit(row.original)}
          />
          <IconButton
            key="delete"
            icon={<DeleteIcon />}
            variant="outline"
            colorScheme="red"
            aria-label="Delete user"
            onClick={() => handleDelete(row.original)}
          />
        </Flex>
      ),
    },
  ];

  const renderRowActions = (user) => (
    <HStack spacing={2}>
      <IconButton
        key="edit"
        aria-label="Edit user"
        icon={<EditIcon />}
        size="sm"
        onClick={() => handleEdit(user)}
        colorScheme="brand"
        variant="outline"
      />
      <IconButton
        key="delete"
        aria-label="Delete user"
        icon={<DeleteIcon />}
        size="sm"
        onClick={() => handleDelete(user)}
        colorScheme="red"
        variant="outline"
      />
    </HStack>
  );

  const isFormChanged = () => {
    if (!selectedUser || !originalFormData) return true;
    return (
      formData.firstName !== originalFormData.firstName ||
      formData.lastName !== originalFormData.lastName ||
      formData.email !== originalFormData.email ||
      formData.phoneNumber !== originalFormData.phoneNumber ||
      formData.role !== originalFormData.role ||
      formData.published !== originalFormData.published ||
      formData.password // If password is provided, consider it a change
    );
  };

  return (
    <Box p={5}>
      {/* Loader at the top, non-blocking */}
      {loading && <Loader size="xl" />}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          User Management
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>
      <HStack spacing={4} mb={6}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none"><SearchIcon color="gray.300" /></InputLeftElement>
          <Input placeholder="Search users..." value={searchTerm} onChange={handleSearch} />
        </InputGroup>
        <Select
          maxW="200px"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          placeholder="Filter by role"
          isDisabled={rolesLoading}
        >
          {roleOptions.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </Select>
      </HStack>
      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredUsers.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!loading ? "No users match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredUsers.length}
        />
      </TableContainer>

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedUser(null);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            role: '',
            password: '',
            confirmPassword: '',
            published: true,
          });
          setOriginalFormData(null);
          setErrors({});
        }}
        title={selectedUser ? 'Edit User' : 'Add New User'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedUser ? 'Update' : 'Save'}
        loadingText={selectedUser ? 'Updating...' : 'Saving...'}
        isDisabled={selectedUser ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <HStack>
            <FormControl isInvalid={!!errors.firstName}>
              <FloatingInput 
                id="firstName" 
                name="firstName" 
                label="First Name" 
                value={formData.firstName || ''} 
                onChange={handleInputChange} 
                error={errors.firstName}  
                required={true}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.lastName}>
              <FloatingInput 
                id="lastName" 
                name="lastName" 
                label="Last Name " 
                value={formData.lastName || ''} 
                onChange={handleInputChange} 
                error={errors.lastName} 
                required={true}
              />
            </FormControl>
          </HStack>
          <FormControl isInvalid={!!errors.email}>
            <FloatingInput 
              id="email" 
              name="email" 
              label="Email" 
              type="email" 
              value={formData.email || ''} 
              onChange={handleInputChange} 
              error={errors.email} 
              required={true}
            />
          </FormControl>
          <FormControl isInvalid={!!errors.phoneNumber}>
            <FloatingInput 
              id="phoneNumber" 
              name="phoneNumber" 
              label="Phone Number" 
              value={formData.phoneNumber || ''} 
              onChange={handleInputChange}
              error={errors.phoneNumber}
              placeholder=""
              required={true}
            />
          </FormControl>
          <FormControl isInvalid={!!errors.role} mb={4}>
            <SearchableSelect
              options={roleOptions}
              value={formData.role || ''}
              onChange={handleRoleChange}
              placeholder={rolesLoading ? "Loading roles..." : "Select a role"}
              searchPlaceholder="Search roles..."
              label="Role"
              error={errors.role}
              isRequired={true}
              isDisabled={rolesLoading}
            />
          </FormControl>
          
          {/* Password fields - show for new users or when editing */}
          {!selectedUser ? (
            <>
              <FormControl isInvalid={!!errors.password}>
                <FloatingInput 
                  id="password" 
                  name="password" 
                  label="Password" 
                  type="password" 
                  value={formData.password || ''} 
                  onChange={handleInputChange} 
                  error={errors.password} 
                  required={true}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FloatingInput 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  label="Confirm Password" 
                  type="password" 
                  value={formData.confirmPassword || ''} 
                  onChange={handleInputChange} 
                  error={errors.confirmPassword} 
                  required={true}
                />
              </FormControl>
            </>
          ) : (
            <FormControl>
              <FloatingInput 
                id="password" 
                name="password" 
                label="Password (optional)" 
                type="password" 
                value={formData.password || ''} 
                onChange={handleInputChange} 
                placeholder=""
              />
            </FormControl>
          )}
          
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
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}?`}
        isLoading={isDeleteLoading}
        loadingText="Deleting..."
      />
    </Box>
  );
};

export default UserManagement; 