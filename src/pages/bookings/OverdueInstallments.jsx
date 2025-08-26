import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Badge,
  useToast,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { FiDownload, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import Loader from '../../components/common/Loader';
import CommonAddButton from '../../components/common/Button/CommonAddButton';
import PurchaseBookingForm from '../../components/common/PurchaseBookingForm';
import PurchaseBookingViewer from '../../components/common/PurchaseBookingViewer';
import { ROUTES } from '../../utils/constants';
import api from '../../services/api';

const OverdueInstallments = () => {
  const toast = useToast();

  // State management
  const [overdueInstallments, setOverdueInstallments] = useState([]);
  const [filteredInstallments, setFilteredInstallments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [installmentToDelete, setInstallmentToDelete] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [isFormLoading, setIsFormLoading] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Filter options
  const filterOptions = {
    status: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'OVERDUE', label: 'Overdue' },
      { value: 'PAID', label: 'Paid' },
      { value: 'PARTIALLY_PAID', label: 'Partially Paid' }
    ]
  };

  // Fetch data from real API
  useEffect(() => {
    fetchOverdueInstallments();
  }, []);

  const fetchOverdueInstallments = async () => {
    try {
      setIsLoading(true);
      
      // Use the configured API service
      const response = await api.get('/purchase-bookings/reports/overdue-installments');
      
      // Handle the actual API response format
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setOverdueInstallments(response.data.data);
        setFilteredInstallments(response.data.data);
      } else {
        setOverdueInstallments([]);
        setFilteredInstallments([]);
      }
    } catch (error) {
      console.error('Error fetching overdue installments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch overdue installments",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setOverdueInstallments([]);
      setFilteredInstallments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = overdueInstallments;

    if (searchTerm) {
      filtered = filtered.filter(installment =>
        (installment.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (installment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (installment.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (installment.salespersonName?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(installment => installment.status === statusFilter);
    }

    setFilteredInstallments(filtered);
    setCurrentPage(1);
  }, [overdueInstallments, searchTerm, statusFilter]);

  // Table columns configuration
  const columns = [
    {
      key: 'installmentNumber',
      label: 'Installment #',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          {value || 'N/A'}
        </Text>
      ),
      width: "100px"
    },
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (value) => (
        <Text color="blue.600" fontWeight="semibold" fontSize="sm">
          {value || 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value) => (
        <Text color="gray.700" noOfLines={1} maxW="150px">
          {value || 'N/A'}
        </Text>
      ),
      width: "150px"
    },
    {
      key: 'propertyName',
      label: 'Property',
      render: (value) => (
        <Text color="gray.700" noOfLines={1} maxW="150px">
          {value || 'N/A'}
        </Text>
      ),
      width: "150px"
    },
    {
      key: 'salespersonName',
      label: 'Salesperson',
      render: (value) => (
        <Text color="gray.700" noOfLines={1} maxW="120px">
          {value || 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => (
        <Text color="gray.700" fontSize="sm">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          ${value ? parseFloat(value).toLocaleString() : '0'}
        </Text>
      ),
      width: "100px"
    },
    {
      key: 'daysOverdue',
      label: 'Days Overdue',
      render: (value) => (
        <Badge
          colorScheme={value > 30 ? 'red' : value > 15 ? 'orange' : 'yellow'}
          variant="solid"
          fontSize="xs"
        >
          {value || 0} days
        </Badge>
      ),
      width: "120px"
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          colorScheme={
            value === 'PAID' ? 'green' :
            value === 'PENDING' ? 'yellow' :
            value === 'OVERDUE' ? 'red' :
            value === 'PARTIALLY_PAID' ? 'blue' : 'gray'
          }
          variant="solid"
          fontSize="xs"
        >
          {value?.replace(/_/g, ' ') || 'N/A'}
        </Badge>
      ),
      width: "100px"
    },
    {
      key: 'lateFees',
      label: 'Late Fees',
      render: (value) => (
        <Text color="red.600" fontWeight="semibold">
          ${value ? parseFloat(value).toLocaleString() : '0'}
        </Text>
      ),
      width: "100px"
    },
  ];

  // Row actions - matching UserManagement style
  const renderRowActions = (installment) => (
    <HStack spacing={2}>
      <IconButton
        key="view"
        aria-label="View installment"
        icon={<FiEye />}
        size="sm"
        onClick={() => handleView(installment._id)}
        colorScheme="blue"
        variant="outline"
      />
      <IconButton
        key="edit"
        aria-label="Edit installment"
        icon={<EditIcon />}
        size="sm"
        onClick={() => handleEdit(installment._id)}
        colorScheme="brand"
        variant="outline"
      />
    </HStack>
  );

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle filters
  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
  };

  // Handle add new installment
  const handleAddNew = () => {
    setSelectedInstallment(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  // Handle edit installment
  const handleEdit = (id) => {
    const installment = overdueInstallments.find(item => item._id === id);
    if (installment) {
    setSelectedInstallment(installment);
      setFormMode('edit');
      setIsFormOpen(true);
    }
  };

  // Handle view installment
  const handleView = (id) => {
    const installment = overdueInstallments.find(item => item._id === id);
    if (installment) {
      setSelectedInstallment(installment);
      setIsViewerOpen(true);
    }
  };

  // Handle delete installment
  const handleDelete = (id) => {
    const installment = overdueInstallments.find(item => item._id === id);
    if (installment) {
      setInstallmentToDelete(installment);
      onDeleteOpen();
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!installmentToDelete) return;

    try {
      setIsDeleteLoading(true);
      
      // Delete API call would go here
      // await api.delete(`/purchase-bookings/${installmentToDelete._id}`);
      
      toast({
        title: "Success",
        description: "Installment deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh data
      fetchOverdueInstallments();
    } catch (error) {
      console.error('Error deleting installment:', error);
      toast({
        title: "Error",
        description: "Failed to delete installment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteLoading(false);
      onDeleteClose();
      setInstallmentToDelete(null);
    }
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      setIsFormLoading(true);
      
      if (formMode === 'add') {
        // Create API call would go here
        // await api.post('/purchase-bookings/create', formData);
        toast({
          title: "Success",
          description: "Installment created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Update API call would go here
        // await api.put(`/purchase-bookings/${selectedInstallment._id}`, formData);
        toast({
          title: "Success",
          description: "Installment updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Refresh data and close form
      fetchOverdueInstallments();
      setIsFormOpen(false);
      setSelectedInstallment(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to save installment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Handle export
  const handleExport = (format) => {
    // Export functionality would go here
    toast({
      title: "Export",
      description: `${format.toUpperCase()} export started`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return <Loader size="xl" label="Loading overdue installments..." />;
  }

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Overdue Installments
          </Text>
        <HStack spacing={3}>
        <Button
            leftIcon={<FiDownload />}
            onClick={() => handleExport('csv')}
            variant="outline"
            colorScheme="green"
            size="sm"
          >
            Export CSV
        </Button>
          <CommonAddButton onClick={handleAddNew} />
        </HStack>
      </Flex>

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}} // No API search needed
        searchPlaceholder="Search overdue installments..."
        filters={{ status: statusFilter }}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {}} // No API filter needed
        onClearFilters={handleClearFilters}
        filterOptions={{
          status: {
            label: "Status",
            placeholder: "Filter by status",
            options: filterOptions.status
          }
        }}
        title="Filter Overdue Installments"
        activeFiltersCount={(statusFilter ? 1 : 0) + (searchTerm ? 1 : 0)}
      />

      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredInstallments.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!isLoading ? "No overdue installments match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredInstallments.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredInstallments.length}
        />
                  </TableContainer>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        isLoading={isDeleteLoading}
        title="Delete Overdue Installment"
        message="Are you sure you want to delete this overdue installment? This action cannot be undone."
      />

      {/* Purchase Booking Form */}
      <PurchaseBookingForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedInstallment(null);
        }}
        mode={formMode}
        initialData={selectedInstallment}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
      />

      {/* Purchase Booking Viewer */}
      <PurchaseBookingViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedInstallment(null);
        }}
        bookingData={selectedInstallment}
        onEdit={(installment) => {
          setSelectedInstallment(installment);
          setIsViewerOpen(false);
          setFormMode('edit');
          setIsFormOpen(true);
        }}
      />
    </Box>
  );
};

export default OverdueInstallments; 