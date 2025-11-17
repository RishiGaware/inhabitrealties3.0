import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  Badge,
  useToast,
  IconButton,
  Heading,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import Loader from '../../components/common/Loader';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { inquiriesService } from '../../services/inquiries/inquiriesService';

const Inquiries = () => {
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });

  // State management
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    status: 'NEW',
  });

  // Filter options
  const filterOptions = {
    status: [
      { value: '', label: 'All Statuses' },
      { value: 'NEW', label: 'New' },
      { value: 'CONTACTED', label: 'Contacted' },
      { value: 'FOLLOW_UP', label: 'Follow Up' },
      { value: 'CONVERTED', label: 'Converted' },
      { value: 'CLOSED', label: 'Closed' },
    ],
  };

  // Fetch inquiries
  const fetchInquiries = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await inquiriesService.getAllInquiries(params);
      
      if (response && response.data && Array.isArray(response.data)) {
        setFilteredInquiries(response.data);
      } else if (response && Array.isArray(response)) {
        setFilteredInquiries(response);
      } else {
        setFilteredInquiries([]);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch inquiries',
        status: 'error',
      });
      setFilteredInquiries([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  // Handle search
  const handleSearch = (e) => {
    const value = typeof e === 'string' ? e : (e?.target?.value || '');
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filters
  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  // Handle edit
  const handleEdit = (inquiry) => {
    setSelectedInquiry(inquiry);
    setFormData({
      name: inquiry.name || '',
      email: inquiry.email || '',
      phone: inquiry.phone || '',
      description: inquiry.description || '',
      status: inquiry.status || 'NEW',
    });
    setIsEditOpen(true);
  };

  // Handle delete
  const handleDelete = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDeleteOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedInquiry) return;

    try {
      setIsDeleting(true);
      await inquiriesService.deleteInquiry(selectedInquiry._id);
      toast({
        title: 'Success',
        description: 'Inquiry deleted successfully',
        status: 'success',
      });
      setIsDeleteOpen(false);
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to delete inquiry',
        status: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle form submit
  const handleFormSubmit = async () => {
    if (!selectedInquiry) return;

    try {
      setIsSaving(true);
      await inquiriesService.updateInquiry(selectedInquiry._id, formData);
      toast({
        title: 'Success',
        description: 'Inquiry updated successfully',
        status: 'success',
      });
      setIsEditOpen(false);
      setSelectedInquiry(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
        status: 'NEW',
      });
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update inquiry',
        status: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'blue';
      case 'CONTACTED': return 'yellow';
      case 'FOLLOW_UP': return 'orange';
      case 'CONVERTED': return 'green';
      case 'CLOSED': return 'gray';
      default: return 'gray';
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value) => (
        <HStack spacing={2}>
          <FiUser size={16} color="gray" />
          <Text fontWeight="semibold" color="gray.700">
            {value || 'N/A'}
          </Text>
        </HStack>
      ),
      width: '200px',
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <HStack spacing={2}>
          <FiMail size={16} color="gray" />
          <Text color="gray.600" fontSize="sm">
            {value || 'N/A'}
          </Text>
        </HStack>
      ),
      width: '200px',
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => (
        <HStack spacing={2}>
          <FiPhone size={16} color="gray" />
          <Text color="gray.600" fontSize="sm">
            {value || 'N/A'}
          </Text>
        </HStack>
      ),
      width: '150px',
    },
    {
      key: 'description',
      label: 'Message',
      render: (value) => (
        <Text color="gray.600" fontSize="sm" noOfLines={2} maxW="300px">
          {value || 'N/A'}
        </Text>
      ),
      width: '300px',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge colorScheme={getStatusColor(value)} variant="solid" fontSize="xs">
          {value?.replace(/_/g, ' ') || 'N/A'}
        </Badge>
      ),
      width: '120px',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <Text color="gray.600" fontSize="sm">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </Text>
      ),
      width: '120px',
    },
  ];

  // Row actions
  const renderRowActions = (inquiry) => (
    <HStack spacing={2}>
      <IconButton
        key="edit"
        aria-label="Edit inquiry"
        icon={<FiEdit />}
        size="sm"
        onClick={() => handleEdit(inquiry)}
        colorScheme="brand"
        variant="outline"
      />
      <IconButton
        key="delete"
        aria-label="Delete inquiry"
        icon={<FiTrash2 />}
        size="sm"
        onClick={() => handleDelete(inquiry)}
        colorScheme="red"
        variant="outline"
      />
    </HStack>
  );

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {isLoading && <Loader size="xl" />}

      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 0 }}>
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
          Inquiries
        </Heading>
      </Flex>

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}}
        searchPlaceholder="Search inquiries..."
        filters={{ status: statusFilter }}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {}}
        onClearFilters={handleClearFilters}
        filterOptions={{
          status: {
            label: 'Status',
            placeholder: 'Filter by status',
            options: filterOptions.status,
          },
        }}
        title="Filter Inquiries"
        activeFiltersCount={(statusFilter ? 1 : 0) + (searchTerm ? 1 : 0)}
      />

      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredInquiries.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!isLoading ? 'No inquiries found.' : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredInquiries.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredInquiries.length}
        />
      </TableContainer>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Inquiry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="CLOSED">Closed</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter message"
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleFormSubmit} isLoading={isSaving}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedInquiry(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Inquiry"
        message="Are you sure you want to delete this inquiry? This action cannot be undone."
      />
    </Box>
  );
};

export default Inquiries;

