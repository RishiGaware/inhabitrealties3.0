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

const PendingInstallments = () => {
  const toast = useToast();

  // State management
  const [pendingInstallments, setPendingInstallments] = useState([]);
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
      { value: 'CONFIRMED', label: 'Confirmed' },
      { value: 'REJECTED', label: 'Rejected' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'CANCELLED', label: 'Cancelled' }
    ]
  };

  // Fetch data from real API
  useEffect(() => {
    fetchPendingInstallments();
  }, []);

  const fetchPendingInstallments = async () => {
    try {
      setIsLoading(true);
      
      // Use the configured API service
      const response = await api.get('/purchase-bookings/reports/pending-installments');
      
      // Handle the actual API response format
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setPendingInstallments(response.data.data);
        setFilteredInstallments(response.data.data);
      } else {
        setPendingInstallments([]);
        setFilteredInstallments([]);
      }
    } catch (error) {
      console.error('Error fetching pending installments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending installments",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setPendingInstallments([]);
      setFilteredInstallments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = pendingInstallments;

    if (searchTerm) {
      filtered = filtered.filter(installment =>
        (installment.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (installment.propertyId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (installment.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (installment.assignedSalespersonId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (installment.installmentSchedule?.installmentNumber?.toString().includes(searchTerm) || false)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(installment => installment.bookingStatus === statusFilter);
    }

    setFilteredInstallments(filtered);
    setCurrentPage(1);
  }, [pendingInstallments, searchTerm, statusFilter]);

  // Table columns configuration
  const columns = [
    {
      key: 'installmentSchedule.installmentNumber',
      label: 'Installment #',
      render: (value, row) => (
        <Text color="gray.700" fontWeight="semibold">
          {row.installmentSchedule?.installmentNumber || 'N/A'}
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
      width: "150px"
    },
    {
      key: 'propertyId',
      label: 'Property ID',
      render: (value) => (
        <Text color="gray.600" fontSize="xs" fontFamily="mono">
          {value ? value.substring(0, 8) + '...' : 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'customerId',
      label: 'Customer ID',
      render: (value) => (
        <Text color="gray.600" fontSize="xs" fontFamily="mono">
          {value ? value.substring(0, 8) + '...' : 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'assignedSalespersonId',
      label: 'Salesperson ID',
      render: (value) => (
        <Text color="gray.600" fontSize="xs" fontFamily="mono">
          {value ? value.substring(0, 8) + '...' : 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'bookingStatus',
      label: 'Booking Status',
      render: (value) => (
        <Badge
          colorScheme={
            value === 'CONFIRMED' ? 'green' :
            value === 'PENDING' ? 'yellow' :
            value === 'REJECTED' ? 'red' :
            value === 'COMPLETED' ? 'blue' : 'gray'
          }
          variant="solid"
          fontSize="xs"
        >
          {value?.replace(/_/g, ' ') || 'N/A'}
        </Badge>
      ),
      width: "120px"
    },
    {
      key: 'totalPropertyValue',
      label: 'Property Value',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          ${value ? parseFloat(value).toLocaleString() : '0'}
        </Text>
      ),
      width: "130px"
    },
    {
      key: 'downPayment',
      label: 'Down Payment',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          ${value ? parseFloat(value).toLocaleString() : '0'}
        </Text>
      ),
      width: "130px"
    },
    {
      key: 'loanAmount',
      label: 'Loan Amount',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          ${value ? parseFloat(value).toLocaleString() : '0'}
        </Text>
      ),
      width: "130px"
    },
    {
      key: 'installmentSchedule.amount',
      label: 'Installment Amount',
      render: (value, row) => (
        <Text color="green.600" fontWeight="semibold">
          ${row.installmentSchedule?.amount ? parseFloat(row.installmentSchedule.amount).toLocaleString() : '0'}
        </Text>
      ),
      width: "150px"
    },
    {
      key: 'installmentSchedule.dueDate',
      label: 'Due Date',
      render: (value, row) => (
        <Text color="gray.700" fontSize="sm">
          {row.installmentSchedule?.dueDate ? new Date(row.installmentSchedule.dueDate).toLocaleDateString() : 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'installmentSchedule.status',
      label: 'Installment Status',
      render: (value, row) => (
        <Badge
          colorScheme={
            row.installmentSchedule?.status === 'PAID' ? 'green' :
            row.installmentSchedule?.status === 'PENDING' ? 'yellow' :
            row.installmentSchedule?.status === 'OVERDUE' ? 'red' :
            row.installmentSchedule?.status === 'PARTIALLY_PAID' ? 'blue' : 'gray'
          }
          variant="solid"
          fontSize="xs"
        >
          {row.installmentSchedule?.status?.replace(/_/g, ' ') || 'N/A'}
        </Badge>
      ),
      width: "140px"
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      render: (value) => (
        <Text color="gray.700" noOfLines={1} maxW="100px">
          {value || 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'installmentCount',
      label: 'Total Installments',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          {value || '0'}
        </Text>
      ),
      width: "130px"
    },
    {
      key: 'isFinanced',
      label: 'Financed',
      render: (value) => (
        <Badge
          colorScheme={value ? 'green' : 'gray'}
          variant="solid"
          fontSize="xs"
        >
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
      width: "100px"
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      render: (value) => (
        <Text color="gray.700" fontSize="sm">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </Text>
      ),
      width: "120px"
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
    const installment = pendingInstallments.find(item => item._id === id);
    if (installment) {
      setSelectedInstallment(installment);
      setFormMode('edit');
      setIsFormOpen(true);
    }
  };

  // Handle view installment
  const handleView = (id) => {
    const installment = pendingInstallments.find(item => item._id === id);
    if (installment) {
    setSelectedInstallment(installment);
      setIsViewerOpen(true);
    }
  };

  // Handle delete installment
  const handleDelete = (id) => {
    const installment = pendingInstallments.find(item => item._id === id);
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
      fetchPendingInstallments();
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
      fetchPendingInstallments();
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
    return <Loader size="xl" label="Loading pending installments..." />;
  }

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Pending Installments
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
        searchPlaceholder="Search by booking ID, property ID, customer ID, salesperson ID, or installment number..."
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
        title="Filter Pending Installments"
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
          emptyStateMessage={!isLoading ? "No pending installments match your search." : undefined}
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
        title="Delete Pending Installment"
        message="Are you sure you want to delete this pending installment? This action cannot be undone."
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

export default PendingInstallments; 