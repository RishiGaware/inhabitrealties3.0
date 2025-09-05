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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { FiDownload, FiEye, FiEdit, FiX } from 'react-icons/fi';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import Loader from '../../components/common/Loader';

import PurchaseBookingViewer from '../../components/common/PurchaseBookingViewer';
import CommonAddButton from '../../components/common/Button/CommonAddButton';
import api from '../../services/api';

const MyAssignedBookings = () => {
  const navigate = useNavigate();
  const toast = useToast();

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
  
  // PDF viewer modal
  const { isOpen: isPdfViewerOpen, onOpen: onPdfViewerOpen, onClose: onPdfViewerClose } = useDisclosure();
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  // Filter options - dynamically generated from API data
  const filterOptions = {
    status: []
  };

  // Generate status options dynamically from the actual data
  useEffect(() => {
    if (bookings.length > 0) {
      const uniqueStatuses = [...new Set(bookings.map(booking => booking.bookingStatus))].filter(Boolean);
      const statusOptions = [
        { value: '', label: 'All Statuses' },
        ...uniqueStatuses.map(status => ({
          value: status,
          label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))
      ];
      filterOptions.status = statusOptions;
    } else {
      // Set default options when no data is available
      filterOptions.status = [
        { value: '', label: 'All Statuses' }
      ];
    }
  }, [bookings]);

  // Fetch data from assigned bookings API
  useEffect(() => {
    fetchAssignedBookings();
  }, []);

  const fetchAssignedBookings = async () => {
    try {
      setIsLoading(true);
      
      // Use the assigned bookings API endpoint
      // Note: You'll need to get the current user's ID from context or auth
      const currentUserId = '68347215de3d56d44b9cbcad'; // This should come from user context
      const response = await api.get(`/purchase-bookings/assigned/${currentUserId}`);
      
      // Handle the actual API response format
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (error) {
      console.error('Error fetching assigned bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assigned bookings",
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

  // Table columns configuration - simplified and essential only
  const columns = [
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
        <VStack align="start" spacing={1}>
          <Text color="gray.700" fontWeight="semibold" noOfLines={1} maxW="150px">
            {row.propertyId?.name || 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="150px">
            {row.propertyId?.propertyAddress?.city || 'N/A'}
          </Text>
        </VStack>
      ),
      width: "150px"
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (_, row) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold" color="gray.800" noOfLines={1} maxW="120px">
            {row.customerId ? `${row.customerId.firstName || ''} ${row.customerId.lastName || ''}`.trim() : 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="120px">
            {row.customerId?.email || 'N/A'}
          </Text>
        </VStack>
      ),
      width: "150px"
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      render: (_, row) => (
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
          ₹{row.totalPropertyValue ? parseFloat(row.totalPropertyValue).toLocaleString() : '0'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      render: (_, row) => {
        const getPaymentTermsColor = (terms) => {
          switch (terms) {
            case 'FULL_PAYMENT': return 'green';
            case 'INSTALLMENTS': return 'blue';
            case 'MILESTONE': return 'purple';
            default: return 'gray';
          }
        };

        return (
          <VStack align="start" spacing={1}>
            <Badge
              colorScheme={getPaymentTermsColor(row.paymentTerms)}
              variant="subtle"
              fontSize="xs"
            >
              {row.paymentTerms?.replace(/_/g, ' ') || 'N/A'}
            </Badge>
            {row.paymentTerms === 'INSTALLMENTS' && row.installmentCount && (
              <Text color="gray.600" fontSize="xs" fontWeight="medium">
                {row.installmentCount} installments
              </Text>
            )}
          </VStack>
        );
      },
      width: "120px"
    },
    {
      key: 'bookingStatus',
      label: 'Status',
      render: (value) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'CONFIRMED': return 'green';
            case 'PENDING': return 'yellow';
            case 'REJECTED': return 'red';
            case 'COMPLETED': return 'blue';
            case 'CANCELLED': return 'gray';
            default: return 'gray';
          }
        };

        return (
          <Badge
            colorScheme={getStatusColor(value)}
            variant="solid"
            fontSize="xs"
          >
            {value?.replace(/_/g, ' ') || 'N/A'}
          </Badge>
        );
      },
      width: "100px"
    },
    {
      key: 'documents',
      label: 'Documents',
      render: (_, row) => {
        const hasDocuments = row.documents && row.documents.length > 0 && row.documents.some(doc => doc.documentUrl);
        const documentCount = hasDocuments ? row.documents.filter(doc => doc.documentUrl).length : 0;
        
        return (
          <HStack spacing={2}>
            {hasDocuments && (
              <Tooltip label={`${documentCount} document(s) available`} placement="top">
                <Badge colorScheme="blue" variant="subtle" size="sm" borderRadius="full" cursor="pointer">
                  📄 {documentCount}
                </Badge>
              </Tooltip>
            )}
            {hasDocuments && (
              <IconButton
                size="xs"
                colorScheme="purple"
                variant="outline"
                icon={<FiEye />}
                onClick={() => {
                  const pdfDoc = row.documents.find(doc => 
                    doc.mimeType?.includes('pdf') || 
                    doc.originalName?.toLowerCase().includes('.pdf')
                  ) || row.documents[0];
                  if (pdfDoc?.documentUrl) {
                    handleViewPdf(pdfDoc.documentUrl, `${row.bookingId || row._id?.slice(-8)} - ${pdfDoc.originalName || 'Document'}`);
                  }
                }}
                aria-label="View documents"
              />
            )}
          </HStack>
        );
      },
      width: "120px"
    },
  ];

  // Row actions - matching AllPurchaseBookings style
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
        icon={<FiEdit />}
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
      // Pass the booking data directly to avoid API call
      navigate(`/purchase-bookings/edit/${id}`, { 
        state: { bookingData: booking } 
      });
    }
  };

  // Handle PDF viewing
  const handleViewPdf = (url, title) => {
    setPdfUrl(url);
    setPdfTitle(title);
    onPdfViewerOpen();
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
        'Property': booking.propertyId?.name || 'N/A',
        'Customer': `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim() || 'N/A',
        'Total Value': `₹${parseFloat(booking.totalPropertyValue || 0).toLocaleString()}`,
        'Payment Terms': booking.paymentTerms || 'N/A',
        'Status': booking.bookingStatus || 'N/A'
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
      a.download = `my_assigned_bookings_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: `Assigned bookings exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export assigned bookings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {/* Loader at the top, non-blocking */}
      {isLoading && <Loader size="xl" />}
      
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 0 }}>
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
          My Assigned Bookings
        </Heading>
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
          <CommonAddButton onClick={() => navigate('/purchase-bookings/create')} />
        </HStack>
      </Flex>

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}} // No API search needed
        searchPlaceholder="Search assigned bookings..."
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
        title="Filter Assigned Bookings"
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
          emptyStateMessage={!isLoading ? "No assigned bookings match your search." : undefined}
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

      {/* Purchase Booking Viewer */}
      <PurchaseBookingViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedBooking(null);
        }}
        bookingData={selectedBooking}
      />

      {/* PDF Viewer Modal */}
      <Modal isOpen={isPdfViewerOpen} onClose={onPdfViewerClose} size="6xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
        <ModalContent maxH="90vh" borderRadius="lg">
          <ModalHeader bg="gray.50" borderBottom="1px" borderColor="gray.200">
            <HStack justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="bold" color="gray.800" noOfLines={1}>
                {pdfTitle}
              </Text>
              <IconButton
                size="sm"
                colorScheme="gray"
                variant="ghost"
                icon={<FiX />}
                onClick={onPdfViewerClose}
                aria-label="Close PDF viewer"
              />
            </HStack>
          </ModalHeader>
          
          <ModalBody p={0} bg="gray.100">
            <Box w="full" h="70vh" position="relative">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', borderRadius: '0 0 8px 8px' }}
                  title={pdfTitle}
                />
              ) : (
                <VStack spacing={4} align="center" justify="center" h="full">
                  <Text fontSize="lg" color="gray.500">Loading PDF...</Text>
                  <Spinner size="lg" color="blue.500" />
                </VStack>
              )}
            </Box>
          </ModalBody>
          
          <ModalFooter bg="gray.50" borderTop="1px" borderColor="gray.200" justifyContent="space-between">
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              leftIcon={<FiDownload />}
              onClick={() => {
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = pdfTitle;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download PDF
            </Button>
            <Button
              size="sm"
              colorScheme="gray"
              variant="outline"
              onClick={onPdfViewerClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyAssignedBookings; 