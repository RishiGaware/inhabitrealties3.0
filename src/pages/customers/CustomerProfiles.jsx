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
  Badge,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import FormModal from '../../components/common/FormModal';
import FloatingInput from '../../components/common/FloatingInput';
import SearchableSelect from '../../components/common/SearchableSelect';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { useUserContext } from '../../context/UserContext';
import { fetchRoles } from '../../services/rolemanagement/roleService';
import { fetchUsersWithParams } from '../../services/usermanagement/userService';
import Loader from '../../components/common/Loader';
import CommonAddButton from '../../components/common/Button/CommonAddButton';
import { showErrorToast } from '../../utils/toastUtils';

const CustomerProfiles = () => {
  // All hooks must be called at the top level
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
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
  const [loading, setLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

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

  // Memoize filtered users to prevent unnecessary re-renders (fallback for local filtering)
  const localFilteredUsers = useMemo(() => {
    // Use filtered users from API if available, otherwise use context users
    let filtered = isFiltered ? filteredUsers : users;
    
    // For customer management, only show users with "user" role
    filtered = filtered.filter(user => user.role === "USER");
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  }, [users, filteredUsers, isFiltered, searchTerm]);

  // Use filtered users from API if available, otherwise use local filtered users
  const displayUsers = isFiltered ? filteredUsers : localFilteredUsers;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // First, get all roles to find the "USER" role ID
      await getAllRoles();
      
      // Wait a bit for roles to be set in state, then find the "USER" role ID
      const userRole = roles.find(role => role.name === "USER");
      
      if (!userRole) {
        console.error('CustomerProfiles: User role not found, using fallback role ID');
        // Fallback: Use the known USER role ID from your API response
        const fallbackRoleId = "681632b6ab1624e874bb2dcf";
        
        // Use fetchUsersWithParams to get only users with "USER" role
        const response = await fetchUsersWithParams({ roleId: fallbackRoleId });
        
        // Store the filtered users directly in state for customer management
        if (response && response.data) {
          setFilteredUsers(response.data);
          setIsFiltered(true);
        }
        return;
      }
      
      // Use fetchUsersWithParams to get only users with "USER" role
      const response = await fetchUsersWithParams({ roleId: userRole._id });
      
      // Store the filtered users directly in state for customer management
      if (response && response.data) {
        setFilteredUsers(response.data);
        setIsFiltered(true);
      }
    } catch (error) {
      console.error('CustomerProfiles: Error fetching users:', error);
      showErrorToast('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users with parameters from API
  const fetchUsersWithFilters = async (params) => {
    setLoading(true);
    try {
      // Find the "USER" role ID
      const userRole = roles.find(role => role.name === "USER");
      
      if (!userRole) {
        console.error('CustomerProfiles: User role not found for filtering, using fallback');
        // Fallback: Use the known USER role ID from your API response
        const fallbackRoleId = "681632b6ab1624e874bb2dcf";
        
        // For customer management, always filter by "USER" role ID
        const customerParams = {
          ...params,
          roleId: fallbackRoleId // Use the fallback role ID
        };
        
        const response = await fetchUsersWithParams(customerParams);
        setFilteredUsers(response.data || []);
        setIsFiltered(true);
        return;
      }
      
      // For customer management, always filter by "USER" role ID
      const customerParams = {
        ...params,
        roleId: userRole._id // Use the actual role ID from the database
      };
      
      const response = await fetchUsersWithParams(customerParams);
      setFilteredUsers(response.data || []);
      setIsFiltered(true);
    } catch (error) {
      console.error('CustomerProfiles: Fetch users with params error:', error);
      setIsFiltered(false); // Fallback to local filtering
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter submission
  const handleSearchSubmit = async () => {
    const params = {};
    
    // Add search term to multiple fields for comprehensive search
    if (searchTerm) {
      params.email = searchTerm;
      params.firstName = searchTerm;
      params.lastName = searchTerm;
      params.phoneNumber = searchTerm;
    }
    
    // Add published filter if set
    if (publishedFilter) {
      params.published = publishedFilter === 'true';
    }
    
    // Always call fetchUsersWithFilters with params (role will be added automatically)
    await fetchUsersWithFilters(params);
  };

  // Handle filter changes (removed role filter for customers)
  const handleFilterChange = (key, value) => {
    if (key === 'published') {
      setPublishedFilter(value);
    }
  };

  // Clear all filters
  const handleClearFilters = async () => {
    setSearchTerm('');
    setPublishedFilter('');
    // Call service with empty params to get all customers (still filtered by USER role)
    await fetchUsersWithFilters({});
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  // Only reset page when filtered results change significantly
  useEffect(() => {
    const maxPage = Math.ceil(displayUsers.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [displayUsers.length, pageSize, currentPage]);

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
    if (!userToDelete) return;
    
    try {
      setIsDeleteLoading(true);
      await removeUser(userToDelete._id);
      
      // Refresh the customer data after delete
      await fetchUsers();
      
      onDeleteClose();
      setUserToDelete(null);
    } catch (error) {
      console.error('CustomerProfiles: Delete error:', error);
      // Error toast is handled by the context
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser._id, formData);
      } else {
        // Add new user
        await addUser(formData);
      }
      
      // Refresh the customer data after add/edit
      await fetchUsers();
      
      onClose();
      setSelectedUser(null);
      setFormData({});
      setErrors({});
    } catch (error) {
      console.error('CustomerProfiles: Form submission error:', error);
      // Error toast is handled by the context
    } finally {
      setIsSubmitting(false);
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
    { 
      key: 'index', 
      label: 'ID',
      render: (value, user) => {
        // Find the index of this user in the filtered data
        const userIndex = filteredUsers.findIndex(u => u._id === user._id);
        return (
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {userIndex + 1}
          </Text>
        );
      },
      width: "50px"
    },
    { 
      key: 'name', 
      label: 'Name', 
      render: (_, row) => (
        <Text fontWeight="semibold" color="gray.800" noOfLines={1} maxW="120px">
          {`${row.firstName} ${row.lastName}`}
        </Text>
      ),
      width: "120px"
    },
    { 
      key: 'email', 
      label: 'Email',
      render: (value) => (
        <Text color="gray.700" noOfLines={1} maxW="150px">
          {value}
        </Text>
      ),
      width: "150px"
    },
    { 
      key: 'phoneNumber', 
      label: 'Phone',
      render: (value) => (
        <Text color="gray.700" noOfLines={1} maxW="100px">
          {value}
        </Text>
      ),
      width: "100px"
    },
    { 
      key: 'role', 
      label: 'Role', 
      render: (role) => (
        <Text color="gray.700" noOfLines={1} maxW="80px">
          {getRoleLabel(role)}
        </Text>
      ),
      width: "80px"
    },
    { 
      key: 'published', 
      label: 'Status', 
      render: (s) => (
        <Badge colorScheme={s ? 'green' : 'red'} variant="solid" fontSize="xs">
          {s ? 'Active' : 'Inactive'}
        </Badge>
      ),
      width: "80px"
    }
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
          Customer Management
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>
      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Search customers by name, email, or phone..."
        filters={{ published: publishedFilter }}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleSearchSubmit}
        onClearFilters={handleClearFilters}
        filterOptions={{
          published: {
            label: "Published Status",
            placeholder: "Filter by published status",
            options: [
              { value: "true", label: "Published" },
              { value: "false", label: "Unpublished" }
            ]
          }
        }}
        title="Search Customers"
        activeFiltersCount={publishedFilter ? 1 : 0}
      />
      <TableContainer>
        <CommonTable
          columns={columns}
          data={displayUsers.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!loading ? "No users match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(displayUsers.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={displayUsers.length}
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
              colorScheme="green"
              size="md"
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

export default CustomerProfiles; 