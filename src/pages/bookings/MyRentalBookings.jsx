import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Badge,
  useToast,
  IconButton,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { FiDownload, FiEye, FiEdit } from 'react-icons/fi';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import Loader from '../../components/common/Loader';
import RentalBookingViewer from '../../components/common/RentalBookingViewer';
import { getPropertyById } from '../../services/propertyService';
import RentalBookingEditForm from '../../components/common/RentalBookingEditForm';
import { rentalBookingService } from '../../services/paymentManagement/rentalBookingService';

const MyRentalBookings = () => {
  const navigate = useNavigate();
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });

  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const parsedAuth = JSON.parse(auth);
        return parsedAuth.data?._id;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  // Fetch user's rental bookings
  const fetchMyRentalBookings = async () => {
    try {
      setIsLoading(true);

      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await rentalBookingService.getMyRentalBookings(userId);

      let raw = [];
      if (response && response.data && Array.isArray(response.data)) {
        raw = response.data;
      } else if (response && Array.isArray(response)) {
        raw = response;
      } else {
        console.warn('Unexpected API response format (my rental bookings):', response);
        raw = [];
      }

      // Enrich not-populated bookings with property details only
      const needPopulate = raw.some(b => !b?.propertyId?.name);
      let enriched = raw;
      if (needPopulate) {
        const populated = await Promise.all(raw.map(async (b) => {
          try {
            if (b && (!b.propertyId?.name) && (b.propertyId)) {
              const property = await getPropertyById(b.propertyId?._id || b.propertyId);
              const propData = property?.data || property;
              return { ...b, propertyId: propData || b.propertyId };
            }
            return b;
          } catch {
            return b;
          }
        }));
        enriched = populated;
      }

      setBookings(enriched);
      setFilteredBookings(enriched);
    } catch (error) {
      console.error('Error fetching rental bookings:', error);
      toast({ title: 'Error', description: 'Failed to fetch my rental bookings', status: 'error' });
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRentalBookings();
  }, []);

  // Filter options - dynamically generated from data
  const filterOptions = { status: [] };
  useEffect(() => {
    if (bookings.length > 0) {
      const uniqueStatuses = [...new Set(bookings.map(b => b.bookingStatus))].filter(Boolean);
      const statusOptions = [
        { value: '', label: 'All Statuses' },
        ...uniqueStatuses.map(status => ({
          value: status,
          label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))
      ];
      filterOptions.status = statusOptions;
    } else {
      filterOptions.status = [{ value: '', label: 'All Statuses' }];
    }
  }, [bookings]);

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
        (booking.propertyId?.propertyAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.bookingStatus === statusFilter);
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, bookings]);

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
    setSearchTerm('');
    setStatusFilter('');
  };

  // Handle export similar to AllRentalBookings
  const handleExport = async () => {
    try {
      const exportData = filteredBookings.map(booking => ({
        'Booking ID': booking.bookingId || booking._id?.slice(-8) || 'N/A',
        'Property': booking.propertyId?.name || 'N/A',
        'Property Location': `${booking.propertyId?.propertyAddress?.city || 'N/A'}, ${booking.propertyId?.propertyAddress?.state || 'N/A'}`,
        'Customer': `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim() || 'N/A',
        'Customer Email': booking.customerId?.email || 'N/A',
        'Monthly Rent': `₹${parseFloat(booking.monthlyRent || 0).toLocaleString()}`,
        'Security Deposit': `₹${parseFloat(booking.securityDeposit || 0).toLocaleString()}`,
        'Rent Due Date': booking.rentDueDate ? `${booking.rentDueDate}th` : 'N/A',
        'Duration': `${booking.duration || 0} months`,
        'Start Date': booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A',
        'End Date': booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A',
        'Status': booking.bookingStatus || 'N/A',
        'Created Date': booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'
      }));

      if (exportData.length === 0) {
        toast({ title: 'No data to export', status: 'info' });
        return;
      }

      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my_rental_bookings_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: 'Export successful', status: 'success' });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: 'Export failed', status: 'error' });
    }
  };

  // Handle view booking
  const handleView = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (!booking) return;
    (async () => {
      try {
        // Always fetch full rental booking to ensure rentSchedule etc.
        const full = await rentalBookingService.getRentalBookingById(id);
        const fullData = full?.data || full;
        // If rent schedule missing, fetch via schedule endpoint if exists
        let rentSchedule = fullData?.rentSchedule;
        if (!Array.isArray(rentSchedule) || rentSchedule.length === 0) {
          try {
            const schedule = await rentalBookingService.getRentSchedule?.(id);
            const schedData = schedule?.data || schedule;
            if (Array.isArray(schedData)) rentSchedule = schedData;
          } catch {}
        }
        // Ensure property details populated
        let propertyData = booking.propertyId;
        if (!propertyData?.name && (booking.propertyId || fullData?.propertyId)) {
          try {
            const prop = await getPropertyById(booking.propertyId?._id || booking.propertyId || fullData.propertyId);
            propertyData = prop?.data || prop || propertyData;
          } catch {}
        }
        setSelectedBooking({ ...booking, ...fullData, rentSchedule, propertyId: propertyData });
        setIsViewerOpen(true);
      } catch {
        setSelectedBooking(booking);
        setIsViewerOpen(true);
      }
    })();
  };

  // Handle edit booking
  const handleEdit = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      setEditingBooking(booking);
      setIsEditFormOpen(true);
    }
  };

  // Table columns
  const columns = [
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (value, row) => (
        <Text fontWeight="semibold" color="blue.600" noOfLines={1} maxW="150px">
          {row.bookingId || row._id?.slice(-8) || 'N/A'}
        </Text>
      ),
    },
    {
      key: 'propertyName',
      label: 'Property',
      render: (_, row) => (
        <VStack align="start" spacing={1}>
          <Text color="gray.700" fontWeight="semibold" noOfLines={1} maxW="150px">
            {row.propertyId?.name || row.propertyName || 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="150px">
            {(row.propertyId?.propertyAddress?.city || row.propertyLocation || 'N/A')}
            {row.propertyId?.propertyAddress?.state ? `, ${row.propertyId.propertyAddress.state}` : ''}
          </Text>
        </VStack>
      ),
    },
    // Customer column removed as requested
    {
      key: 'monthlyRent',
      label: 'Monthly Rent',
      render: (_, row) => (
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
          ₹{row.monthlyRent ? parseFloat(row.monthlyRent).toLocaleString() : '0'}
        </Text>
      ),
    },
    {
      key: 'securityDeposit',
      label: 'Security Deposit',
      render: (_, row) => (
        <Text>₹{parseFloat(row.securityDeposit || 0).toLocaleString()}</Text>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_, row) => (
        <Text fontSize="sm">{row.duration || 0} months</Text>
      ),
    },
    {
      key: 'bookingStatus',
      label: 'Status',
      render: (value, row) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'ACTIVE': return 'green';
            case 'PENDING': return 'yellow';
            case 'EXPIRED': return 'red';
            case 'CANCELLED': return 'gray';
            default: return 'gray';
          }
        };
        return (
          <Badge colorScheme={getStatusColor(row.bookingStatus)} variant="solid" fontSize="xs">
            {row.bookingStatus?.replace(/_/g, ' ') || 'N/A'}
          </Badge>
        );
      },
    },
  ];

  // Row actions - view only
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
    </HStack>
  );

  // Show loading state
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {isLoading && <Loader size="xl" />}

      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 0 }}>
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
          My Rental Bookings
        </Heading>
        <HStack spacing={3}>
          <Button
            leftIcon={<FiDownload />}
            onClick={handleExport}
            variant="outline"
            colorScheme="green"
            size="sm"
          >
            Export CSV
          </Button>
        </HStack>
      </Flex>

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}}
        searchPlaceholder="Search by booking ID, customer, property..."
        filters={{ status: statusFilter }}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {}}
        onClearFilters={handleClearFilters}
        filterOptions={{
          status: {
            label: 'Status',
            placeholder: 'Filter by status',
            options: filterOptions.status
          }
        }}
        title="Filter Rental Bookings"
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
          emptyStateMessage={!isLoading ? 'No rental bookings match your search.' : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredBookings.length / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredBookings.length}
        />
      </TableContainer>

      <RentalBookingViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedBooking(null);
        }}
        bookingData={selectedBooking}
        hideCustomerDetails
      />

      <RentalBookingEditForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingBooking(null);
        }}
        bookingData={editingBooking}
        onUpdate={() => {
          fetchMyRentalBookings();
        }}
      />
    </Box>
  );
};

export default MyRentalBookings;
