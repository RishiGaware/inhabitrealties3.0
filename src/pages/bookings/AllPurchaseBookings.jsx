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

const AllPurchaseBookings = () => {
  const toast = useToast();

  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
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
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      // Use the configured API service
      const response = await api.get('/purchase-bookings/all');
      
      // Handle the actual API response format
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch purchase bookings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        (booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.propertyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.bookingStatus === statusFilter);
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, bookings]);

  // Table columns configuration - matching UserManagement style
  const columns = [
    { 
      key: 'index', 
      label: 'ID',
      render: (value, booking) => {
        const bookingIndex = filteredBookings.findIndex(b => b._id === booking._id);
        return (
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {bookingIndex + 1}
          </Text>
        );
      },
      width: "50px"
    },
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (value, row) => (
        <Text fontWeight="semibold" color="blue.600" noOfLines={1} maxW="150px">
          {value || row._id?.slice(-8) || 'N/A'}
        </Text>
      ),
      width: "150px"
    },
    
    {
      key: 'propertyName',
      label: 'Property',
      render: (_, row) => (
        <Text color="gray.700" noOfLines={1} maxW="150px">
          {row.propertyId?.name || 'N/A'}
        </Text>
      ),
      width: "150px"
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (_, row) => (
        <Text fontWeight="semibold" color="gray.800" noOfLines={1} maxW="120px">
          {row.customerId ? `${row.customerId.firstName || ''} ${row.customerId.lastName || ''}`.trim() : 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'customerEmail',
      label: 'Customer Email',
      render: (_, row) => (
        <Text color="gray.700" noOfLines={1} maxW="150px">
          {row.customerId?.email || 'N/A'}
        </Text>
      ),
      width: "150px"
    },
    {
      key: 'salespersonName',
      label: 'Salesperson',
      render: (_, row) => (
        <Text color="gray.700" noOfLines={1} maxW="120px">
          {row.assignedSalespersonId ? `${row.assignedSalespersonId.firstName || ''} ${row.assignedSalespersonId.lastName || ''}`.trim() : 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'totalPropertyValue',
      label: 'Total Value',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          ${value ? parseFloat(value).toLocaleString() : '0'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'downPayment',
      label: 'Down Payment',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          ${value ? parseFloat(value).toLocaleString() : '0'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      render: (value) => (
        <Text color="gray.700" noOfLines={1} maxW="100px">
          {value || 'N/A'}
        </Text>
      ),
      width: "100px"
    },
    {
      key: 'installmentCount',
      label: 'Installments',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold">
          {value || '0'}
        </Text>
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
    {
      key: 'bookingStatus',
      label: 'Status',
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
      width: "100px"
    },
  ];

  // Row actions - matching UserManagement style
  const renderRowActions = (booking) => (
    <HStack spacing={2}>
      <IconButton
        key="view"
        aria-label="View booking"
        icon={<FiEye />}
        size="sm"
        onClick={() => handleView(booking._id)}
        colorScheme="blue"
        variant="outline"
      />
      <IconButton
        key="edit"
        aria-label="Edit booking"
        icon={<EditIcon />}
        size="sm"
        onClick={() => handleEdit(booking._id)}
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

  // Handle add new booking
  const handleAddNew = () => {
    setSelectedBooking(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setIsFormLoading(true);
      
      if (formMode === 'edit' && selectedBooking) {
        // Update existing booking
        await api.put(`/purchase-bookings/update/${selectedBooking.bookingId || selectedBooking._id}`, formData);
        toast({
          title: "Success",
          description: "Purchase booking updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new booking
        await api.post('/purchase-bookings/create', formData);
        toast({
          title: "Success",
          description: "Purchase booking created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Refresh the data
      fetchBookings();
      
      // Close form
      setIsFormOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: `Failed to ${formMode === 'add' ? 'create' : 'update'} purchase booking`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle view booking
  const handleView = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      setSelectedBooking(booking);
      setIsViewerOpen(true);
    }
  };

  // Handle edit booking
  const handleEdit = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      setSelectedBooking(booking);
      setFormMode('edit');
      setIsFormOpen(true);
    }
  };

  // Handle delete booking
  const handleDelete = (id) => {
    setBookingToDelete(id);
    onDeleteOpen();
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!bookingToDelete) return;

    try {
      setIsDeleteLoading(true);
      
      // Use the configured API service for deletion
      await api.delete(`/purchase-bookings/delete/${bookingToDelete}`);

      toast({
        title: "Success",
        description: "Purchase booking deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh the data
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete purchase booking",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteLoading(false);
      onDeleteClose();
      setBookingToDelete(null);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredBookings.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Handle export
  const handleExport = async (format) => {
    try {
      // Create CSV content from the actual data
      const exportData = filteredBookings.map(booking => ({
        'Booking ID': booking.bookingId || booking._id?.slice(-8) || 'N/A',
        'Status': booking.bookingStatus || 'N/A',
        'Property': booking.propertyId?.name || 'N/A',
        'Customer': `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim() || 'N/A',
        'Customer Email': booking.customerId?.email || 'N/A',
        'Salesperson': `${booking.assignedSalespersonId?.firstName || ''} ${booking.assignedSalespersonId?.lastName || ''}`.trim() || 'N/A',
        'Total Value': `$${parseFloat(booking.totalPropertyValue || 0).toLocaleString()}`,
        'Down Payment': `$${parseFloat(booking.downPayment || 0).toLocaleString()}`,
        'Payment Terms': booking.paymentTerms || 'N/A',
        'Installments': booking.installmentCount || '0',
        'Created Date': booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'
      }));

      // Generate CSV
      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `purchase_bookings_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: `Purchase bookings exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export purchase bookings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      {/* Loader at the top, non-blocking */}
      {isLoading && <Loader size="xl" />}
      
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          All Purchase Bookings
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
        searchPlaceholder="Search bookings..."
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
        title="Filter Bookings"
        activeFiltersCount={(statusFilter ? 1 : 0) + (searchTerm ? 1 : 0)}
      />

      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredBookings.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!isLoading ? "No purchase bookings match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredBookings.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredBookings.length}
        />
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        isLoading={isDeleteLoading}
        title="Delete Purchase Booking"
        message="Are you sure you want to delete this purchase booking? This action cannot be undone."
      />

      {/* Purchase Booking Form */}
      <PurchaseBookingForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBooking(null);
        }}
        mode={formMode}
        initialData={selectedBooking}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
      />

      {/* Purchase Booking Viewer */}
      <PurchaseBookingViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedBooking(null);
        }}
        bookingData={selectedBooking}
        onEdit={(booking) => {
          setSelectedBooking(booking);
          setIsViewerOpen(false);
          setFormMode('edit');
          setIsFormOpen(true);
        }}
      />
    </Box>
  );
};

export default AllPurchaseBookings; 