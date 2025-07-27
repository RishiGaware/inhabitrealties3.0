import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Badge,
  Button,
  Grid,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  IconButton,
} from '@chakra-ui/react';
import { FaEye, FaCalendar, FaMapMarkerAlt, FaClock, FaUser, FaSearch, FaHome, FaEnvelope, FaStickyNote, FaUsers, FaMap } from 'react-icons/fa';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import Loader from '../../components/common/Loader';
import { 
  getMyMeetings,
} from '../../services/meetings/meetingScheduleService';
import { fetchAllMeetingScheduleStatuses } from '../../services/meetings/meetingScheduleStatusService';
import { showErrorToast } from '../../utils/toastUtils';
import { fetchProperties } from '../../services/propertyService';
import { fetchUsers } from '../../services/usermanagement/userService';

const MyMeetings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [rawMyMeetings, setRawMyMeetings] = useState([]);
  const [counts, setCounts] = useState({
    totalMeetings: 0,
    totalScheduled: 0,
    totalRescheduled: 0,
    totalCompleted: 0,
    totalCancelled: 0
  });
  const [statuses, setStatuses] = useState([]);
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();

  // Helper function to get customer details by ID
  const getCustomerDetails = (customerId) => {
    if (!customerId) {
      return { name: 'No Customer', email: 'No email' };
    }
    
    const customer = users.find(user => user._id === customerId);
    
    if (customer) {
      return {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email
      };
    } else {
      return {
        name: `Customer ID: ${customerId}`,
        email: 'Customer not found'
      };
    }
  };

  // Helper function to get multiple customer details
  const getMultipleCustomerDetails = (customerIds) => {
    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return [{ name: 'No Customer', email: 'No email' }];
    }
    return customerIds.map(customerId => getCustomerDetails(customerId));
  };

  // Helper function to get property details by ID
  const getPropertyDetails = (propertyId) => {
    if (!propertyId) {
      return { name: 'No Property', location: 'No location', price: 'No price' };
    }
    
    const property = properties.find(prop => prop._id === propertyId);
    
    if (!property) {
      return {
        name: `Property ID: ${propertyId}`,
        location: 'Property not found',
        price: 'Price not available'
      };
    }

    // Build full address from propertyAddress
    let location = 'No location';
    if (property.propertyAddress) {
      const addr = property.propertyAddress;
      const addressParts = [];
      
      if (addr.street) addressParts.push(addr.street);
      if (addr.area) addressParts.push(addr.area);
      if (addr.city) addressParts.push(addr.city);
      if (addr.state) addressParts.push(addr.state);
      if (addr.zipOrPinCode) addressParts.push(addr.zipOrPinCode);
      if (addr.country) addressParts.push(addr.country);
      
      location = addressParts.length > 0 ? addressParts.join(', ') : 'No location';
    }
    
    return {
      name: property.name || 'No name',
      location: location,
      price: property.price ? `₹${property.price.toLocaleString()}` : 'Price not set'
    };
  };

  // Fetch my meetings data
  const fetchMyMeetingsData = async () => {
    setLoading(true);
    try {
      // Get current user ID from context or localStorage
      const auth = JSON.parse(localStorage.getItem("auth"));
      const currentUserId = auth?.data?._id;
      
      if (!currentUserId) {
        console.error('MyMeetings: No current user ID found');
        showErrorToast('User not authenticated');
        setRawMyMeetings([]);
        return;
      }

      // Fetch meetings, users, properties, and statuses in parallel
      const [myMeetingsResponse, usersResponse, propertiesResponse, statusesResponse] = await Promise.all([
        getMyMeetings(currentUserId),
        fetchUsers(),
        fetchProperties(),
        fetchAllMeetingScheduleStatuses()
      ]);

      // Set users and properties
      if (usersResponse && usersResponse.data) {
        setUsers(usersResponse.data);
      } 
    
      if (propertiesResponse && propertiesResponse.data) {
        setProperties(propertiesResponse.data);
      }
      
      if (statusesResponse && statusesResponse.data) {
        setStatuses(statusesResponse.data);
      }
      
      // Store raw meetings data
      if (myMeetingsResponse && myMeetingsResponse.data) {
        setRawMyMeetings(myMeetingsResponse.data);
        
        // Set counts from API response
        if (myMeetingsResponse.counts) {
          setCounts(myMeetingsResponse.counts);
        } else {
          // Calculate counts from data if not provided by backend
          const totalMeetings = myMeetingsResponse.data.length;
          const totalScheduled = myMeetingsResponse.data.filter(m => m.status?.name === 'Scheduled').length;
          const totalRescheduled = myMeetingsResponse.data.filter(m => m.status?.name === 'Rescheduled').length;
          const totalCompleted = myMeetingsResponse.data.filter(m => m.status?.name === 'Completed').length;
          const totalCancelled = myMeetingsResponse.data.filter(m => m.status?.name === 'Cancelled').length;
          
          setCounts({
          totalMeetings,
          totalScheduled,
      totalRescheduled,
          totalCompleted,
          totalCancelled
          });
        }
      } else {
        setRawMyMeetings([]);
        setCounts({
          totalMeetings: 0,
          totalScheduled: 0,
          totalRescheduled: 0,
          totalCompleted: 0,
          totalCancelled: 0
        });
      }
    } catch (error) {
      console.error('MyMeetings: Error fetching my meetings:', error);
      showErrorToast('Failed to fetch my meetings. Please try again.');
      setRawMyMeetings([]);
      setCounts({
        totalMeetings: 0,
        totalScheduled: 0,
        totalRescheduled: 0,
        totalCompleted: 0,
        totalCancelled: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMeetingsData();
  }, []);

  // Transform meetings when users and properties are available
  useEffect(() => {
    if (rawMyMeetings.length > 0) {
      // Always transform meetings, even if users/properties aren't loaded yet
      const transformedMeetings = rawMyMeetings.map(meeting => {
        // Determine the actual customer IDs and details
        let actualCustomerIds = [];
        let customerDetails = [];
        
        // Handle both single customerId and multiple customerIds
        if (meeting.customerIds && Array.isArray(meeting.customerIds)) {
          // Multiple customers
          actualCustomerIds = meeting.customerIds;
          if (users.length > 0) {
            customerDetails = getMultipleCustomerDetails(meeting.customerIds);
          } else {
            customerDetails = [{ name: 'Loading...', email: 'Loading...' }];
          }
        } else if (meeting.customerId && typeof meeting.customerId === 'object' && meeting.customerId.firstName) {
          // Backend populated single customer data - extract the ID
          actualCustomerIds = [meeting.customerId._id || meeting.customerId.id];
          customerDetails = [{
            name: `${meeting.customerId.firstName} ${meeting.customerId.lastName}`,
            email: meeting.customerId.email
          }];
        } else if (users.length > 0 && meeting.customerId) {
          // Single customer by ID
          actualCustomerIds = [meeting.customerId];
          customerDetails = [getCustomerDetails(meeting.customerId)];
        } else if (!meeting.customerId && !meeting.customerIds) {
          customerDetails = [{ name: 'No Customer', email: 'No email' }];
        } else {
          customerDetails = [{ name: 'Loading...', email: 'Loading...' }];
        }
        
        // Format customer display for table
        const customerDisplayName = customerDetails.length > 1
          ? `${customerDetails[0].name} +${customerDetails.length - 1} more`
          : customerDetails[0]?.name || 'No Customer';
        const customerDisplayEmail = customerDetails.length > 0
          ? customerDetails[0]?.email || 'No email'
          : 'No email';

        // Get property details
        const propertyDetails = getPropertyDetails(meeting.propertyId);
        const actualPropertyId = meeting.propertyId;

        // Debug: Log the meeting status structure
        console.log('Meeting status debug:', {
          meetingId: meeting._id,
          status: meeting.status,
          statusType: typeof meeting.status,
          statusName: meeting.status?.name,
          statusId: meeting.status?._id
        });

        // Try to get status name from different possible structures
        let statusName = 'Unknown Status';
        let statusId = '';
        
        if (meeting.status && typeof meeting.status === 'object' && meeting.status.name) {
          // Status is populated object with name
          statusName = meeting.status.name;
          statusId = meeting.status._id || '';
        } else if (meeting.status && typeof meeting.status === 'string') {
          // Status is just a string (ID)
          statusId = meeting.status;
          // Try to find status name from statuses array
          const statusObj = statuses.find(s => s._id === meeting.status);
          statusName = statusObj ? statusObj.name : 'Unknown Status';
        } else if (meeting.status) {
          // Status exists but structure is unclear
          statusName = meeting.status.name || meeting.status.toString();
          statusId = meeting.status._id || meeting.status;
        }

        return {
          id: meeting._id,
          title: meeting.title,
          description: meeting.description,
          customerName: customerDisplayName,
          customerEmail: customerDisplayEmail,
          customerDetails: customerDetails, // Store full details for modal
          propertyName: propertyDetails.name,
          propertyLocation: propertyDetails.location,
          propertyPrice: propertyDetails.price,
          meetingDate: meeting.meetingDate,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          status: statusName,
          statusId: statusId,
          salesPersonEmail: meeting.scheduledByUserId?.email || 'No email',
          location: propertyDetails.location,
          notes: meeting.notes,
          duration: meeting.duration,
          // Preserve original IDs for form editing
          customerIds: actualCustomerIds,
          propertyId: actualPropertyId
        };
      });
      
      setMeetings(transformedMeetings);
    } else {
      // Clear meetings if no data to transform
      setMeetings([]);
    }
  }, [rawMyMeetings, users, properties, statuses]);

  // Filter meetings based on search and status
  const filteredMeetings = useMemo(() => {
    const filtered = meetings.filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (meeting.propertyName && meeting.propertyName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !statusFilter || meeting.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    return filtered;
  }, [meetings, searchTerm, statusFilter]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    onViewModalOpen();
  };

  const handleMapRedirect = (location) => {
    if (location && location !== 'No location') {
      const encodedLocation = encodeURIComponent(location);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'green';
      case 'Completed': return 'blue';
      case 'Cancelled': return 'red';
      case 'Rescheduled': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled': return '📅';
      case 'Completed': return '✅';
      case 'Cancelled': return '❌';
      case 'Rescheduled': return '🔄';
      default: return '📋';
    }
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'No duration';
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Title',
      render: (value, meeting) => (
        <Box>
          <Text fontWeight="semibold" color={textColor}>{value}</Text>
          <Text fontSize="xs" color={subTextColor}>{meeting.description || 'No description'}</Text>
        </Box>
      )
    },
    { 
      key: 'customerName', 
      label: 'Customer',
      render: (value, meeting) => (
        <Box>
          <Text fontWeight="semibold" color={textColor}>{value}</Text>
          <Text fontSize="xs" color={subTextColor}>{meeting.customerEmail}</Text>
        </Box>
      )
    },
    { 
      key: 'propertyName', 
      label: 'Property',
      render: (value, meeting) => (
        <Box>
          <Text fontWeight="semibold" color={textColor}>{value}</Text>
          <Text fontSize="xs" color={subTextColor}>
            {meeting.propertyLocation} • {meeting.propertyPrice}
          </Text>
        </Box>
      )
    },
    { 
      key: 'meetingDate', 
      label: 'Date & Time',
      render: (value, meeting) => {
        const duration = calculateDuration(meeting.startTime, meeting.endTime);
        return (
          <Box>
            <Text fontWeight="semibold" color={textColor}>
              {new Date(meeting.meetingDate).toLocaleDateString()}
            </Text>
            <Text fontSize="xs" color={subTextColor}>
              {meeting.startTime} - {meeting.endTime || 'No end time'} ({duration})
            </Text>
          </Box>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Badge colorScheme={getStatusColor(status)} variant="solid">
          {getStatusIcon(status)} {status}
        </Badge>
      )
    }
  ];

  const rowActions = (meeting) => (
    <HStack spacing={2}>
      <IconButton
        aria-label="View meeting"
        icon={<FaEye />}
        size="sm"
        onClick={() => handleViewMeeting(meeting)}
        colorScheme="blue"
        variant="outline"
        _hover={{
          bg: "blue.50",
          borderColor: "blue.400",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)"
        }}
        _active={{
          bg: "blue.100",
          transform: "translateY(0px)"
        }}
        transition="all 0.2s ease"
      />
    </HStack>
  );

  const SummaryCards = () => (
    <Grid 
      templateColumns={{ 
        base: 'repeat(2, 1fr)', 
        sm: 'repeat(3, 1fr)', 
        md: 'repeat(4, 1fr)', 
        lg: 'repeat(5, 1fr)' 
      }} 
      gap={{ base: 2, sm: 3, md: 4 }} 
      mb={6}
      w="full"
      maxW="full"
      overflow="hidden"
    >
      {/* Total Meetings Card */}
      <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        p={{ base: 3, sm: 4 }}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "xl",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
        minW="0"
        flex="1"
      >
        <VStack spacing={2} align="center">
          <Box
            p={2}
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius="lg"
          >
            <FaCalendar size={14} color="white" />
      </Box>
          <Text color="white" fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium" textAlign="center" noOfLines={1}>
            TOTAL MEETINGS
          </Text>
          <Text color="white" fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold" textAlign="center">
            {counts.totalMeetings}
          </Text>
        </VStack>
      </Box>

            {/* Scheduled Card */}
      <Box
        bg="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
        p={{ base: 3, sm: 4 }}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "xl",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
        minW="0"
        flex="1"
      >
        <VStack spacing={2} align="center">
          <Box
            p={2}
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius="lg"
          >
            <FaCalendar size={14} color="white" />
            </Box>
          <Text color="white" fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium" textAlign="center" noOfLines={1}>
            SCHEDULED
          </Text>
          <Text color="white" fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold" textAlign="center">
            {counts.totalScheduled}
          </Text>
        </VStack>
            </Box>

      {/* Rescheduled Card */}
      <Box
        bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        p={{ base: 3, sm: 4 }}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "xl",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
        minW="0"
        flex="1"
      >
        <VStack spacing={2} align="center">
          <Box
            p={2}
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius="lg"
          >
            <FaCalendar size={14} color="white" />
            </Box>
          <Text color="white" fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium" textAlign="center" noOfLines={1}>
            RESCHEDULED
          </Text>
          <Text color="white" fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold" textAlign="center">
            {counts.totalRescheduled}
          </Text>
        </VStack>
            </Box>

      {/* Completed Card */}
      <Box
        bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        p={{ base: 3, sm: 4 }}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "xl",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
        minW="0"
        flex="1"
      >
        <VStack spacing={2} align="center">
          <Box
            p={2}
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius="lg"
          >
            <FaCalendar size={14} color="white" />
            </Box>
          <Text color="white" fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium" textAlign="center" noOfLines={1}>
            COMPLETED
          </Text>
          <Text color="white" fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold" textAlign="center">
            {counts.totalCompleted}
          </Text>
        </VStack>
            </Box>

      {/* Cancelled Card */}
      <Box
        bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
        p={{ base: 3, sm: 4 }}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "xl",
          transition: "all 0.2s ease"
        }}
        transition="all 0.2s ease"
        minW="0"
        flex="1"
      >
        <VStack spacing={2} align="center">
          <Box
            p={2}
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius="lg"
          >
            <FaCalendar size={14} color="white" />
            </Box>
          <Text color="white" fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium" textAlign="center" noOfLines={1}>
            CANCELLED
          </Text>
          <Text color="white" fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold" textAlign="center">
            {counts.totalCancelled}
          </Text>
        </VStack>
            </Box>
      </Grid>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Box p={{ base: 3, sm: 4, md: 6 }}>
      {/* Header */}
      <HStack justify="space-between" align="center" mb={6} flexWrap="wrap">
        <Heading as="h1" fontSize={{ base: "xl", sm: "2xl" }} fontWeight="bold">
          My Meetings
        </Heading>
      </HStack>



      {/* Summary Cards */}
      <SummaryCards />

      {/* Search and Filter */}
      <Box 
        p={4} 
        bg="white" 
        borderRadius="xl" 
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
        border="1px solid"
        borderColor="gray.100"
        mb={6}
      >
        <HStack spacing={4} align="center">
          <InputGroup maxW={{ base: "full", sm: "400px" }}>
          <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search meetings..." 
            value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              _focus={{
                borderColor: "purple.400",
                boxShadow: "0 0 0 1px rgba(147, 51, 234, 0.2)"
              }}
              _hover={{
                borderColor: "gray.300"
              }}
          />
        </InputGroup>
        <Select
            maxW={{ base: "full", sm: "200px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="Filter by status"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            _focus={{
              borderColor: "purple.400",
              boxShadow: "0 0 0 1px rgba(147, 51, 234, 0.2)"
            }}
            _hover={{
              borderColor: "gray.300"
            }}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Rescheduled">Rescheduled</option>
        </Select>
      </HStack>
      </Box>

      {/* Table */}
      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredMeetings.slice(startIndex, startIndex + itemsPerPage)}
          rowActions={rowActions}
          emptyStateMessage="No meetings found."
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredMeetings.length / itemsPerPage)}
          onPageChange={handlePageChange}
          pageSize={itemsPerPage}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredMeetings.length}
        />
      </TableContainer>

      {/* View Meeting Modal */}
      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size="4xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius={{ base: "0", md: "2xl" }}
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
          maxW={{ base: "100vw", sm: "95vw", md: "70vw", lg: "900px" }}
          mx={{ base: 0, md: 4 }}
          overflow="hidden"
          minH={{ base: "100vh", md: "40vh" }}
          maxH={{ base: "100vh", md: "90vh" }}
        >
          {/* Enhanced Header */}
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            p={{ base: 4, md: 6 }}
            position="relative"
            overflow="hidden"
            minH={{ base: "120px", md: "140px" }}
          >
            <Box
              position="absolute"
              top="-50%"
              right="-50%"
              w="200px"
              h="200px"
              bg="white"
              opacity="0.1"
              borderRadius="full"
            />
            <Box
              position="absolute"
              bottom="-30%"
              left="-30%"
              w="150px"
              h="150px"
              bg="white"
              opacity="0.05"
              borderRadius="full"
            />
            <VStack spacing={3} align="start">
              <Flex justify="space-between" align="start" w="full">
                <VStack align="start" spacing={2} flex={1}>
                  <Text color="white" fontSize={{ base: "lg", md: "2xl", lg: "3xl" }} fontWeight="bold">
                  Meeting Details
                </Text>
                  <Text color="white" opacity="0.9" fontSize={{ base: "xs", md: "sm", lg: "md" }}>
                    My Meeting Management
                </Text>
              </VStack>
              <Box
                  p={4}
                bg="white"
                borderRadius="full"
                opacity="0.2"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                  <FaCalendar size={28} color="white" />
              </Box>
            </Flex>
              {selectedMeeting && (
                <Badge
                  colorScheme={getStatusColor(selectedMeeting.status)}
                  variant="solid"
                  fontSize={{ base: "xs", md: "sm" }}
                  px={4}
                  py={2}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  alignSelf="flex-start"
                  mt={2}
                >
                  {getStatusIcon(selectedMeeting.status)} {selectedMeeting.status}
                </Badge>
              )}
            </VStack>
          </Box>
          <ModalCloseButton
            color="white"
            bg="rgba(255,255,255,0.2)"
            borderRadius="full"
            _hover={{ bg: "rgba(255,255,255,0.3)" }}
            top={4}
            right={4}
            position={{ base: "fixed", md: "absolute" }}
            zIndex={{ base: 9999, md: 1 }}
          />
          <ModalBody p={0} overflowY="auto" maxH={{ base: "calc(100vh - 180px)", md: "calc(90vh - 180px)" }}>
            {selectedMeeting && (
              <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={0}>
                {/* Left Column - Property & Schedule */}
                <VStack spacing={0} align="stretch">
                  {/* Property Details Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
                    <Flex align="center" gap={4} mb={4}>
                      <Box
                        p={3}
                        bg="blue.50"
                        borderRadius="2xl"
                        color="blue.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaHome size={20} />
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize={{ base: "sm", md: "md", lg: "lg" }} color="gray.800">
                          Property Details
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "xs", md: "sm", lg: "md" }} mt={1}>
                          {selectedMeeting.propertyName}
                        </Text>
                      </Box>
                    </Flex>
                    <VStack spacing={3} align="stretch">
                      <HStack spacing={3} align="center" p={3} bg="gray.50" borderRadius="xl">
                      <Box
                        p={2}
                          bg="white"
                        borderRadius="lg"
                          color="blue.600"
                          boxShadow="sm"
                      >
                          <FaMapMarkerAlt size={14} />
                      </Box>
                        <Box flex={1}>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Location
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                        {selectedMeeting.propertyLocation}
                      </Text>
                        </Box>
                                     <Button
               size="sm"
               variant="outline"
               onClick={() => handleMapRedirect(selectedMeeting.propertyLocation)}
               isDisabled={!selectedMeeting.propertyLocation || selectedMeeting.propertyLocation === 'No location'}
               leftIcon={<FaMap size={12} />}
               fontSize="xs"
               fontWeight="medium"
               px={3}
               py={1}
               borderRadius="md"
               border="2px solid"
               borderColor="transparent"
               background="linear-gradient(white, white) padding-box, linear-gradient(45deg, #4285F4 0%, #34A853 25%, #FBBC05 50%, #EA4335 75%, #4285F4 100%) border-box"
               _hover={{
                 background: "linear-gradient(gray.50, gray.50) padding-box, linear-gradient(45deg, #4285F4 0%, #34A853 25%, #FBBC05 50%, #EA4335 75%, #4285F4 100%) border-box"
               }}
               color="gray.700"
             >
               Map
             </Button>
                    </HStack>
                      <HStack spacing={3} align="center" p={3} bg="green.50" borderRadius="xl">
                        <Box
                          p={2}
                          bg="white"
                          borderRadius="lg"
                          color="green.600"
                          boxShadow="sm"
                        >
                          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">₹</Text>
                        </Box>
                        <Box flex={1}>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Price
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                            {selectedMeeting.propertyPrice}
                          </Text>
                        </Box>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Schedule Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom={{ base: "1px solid", lg: "none" }} borderColor="gray.100">
                    <Flex align="center" gap={4} mb={4}>
                      <Box
                        p={3}
                        bg="green.50"
                        borderRadius="2xl"
                        color="green.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaClock size={20} />
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize={{ base: "sm", md: "md", lg: "lg" }} color="gray.800">
                          Schedule
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "xs", md: "sm", lg: "md" }} mt={1}>
                          {new Date(selectedMeeting.meetingDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </Box>
                    </Flex>
                    <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3}>
                      <Box p={3} bg="blue.50" borderRadius="xl">
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                            bg="white"
                          borderRadius="lg"
                          color="blue.600"
                            boxShadow="sm"
                        >
                            <FaCalendar size={12} />
                        </Box>
                        <Box>
                            <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Date
                          </Text>
                            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                              {new Date(selectedMeeting.meetingDate).toLocaleDateString()}
                          </Text>
                        </Box>
                      </HStack>
                      </Box>
                      <Box p={3} bg="purple.50" borderRadius="xl">
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                            bg="white"
                          borderRadius="lg"
                          color="purple.600"
                            boxShadow="sm"
                        >
                            <FaClock size={12} />
                        </Box>
                        <Box>
                            <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Time
                          </Text>
                            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                              {selectedMeeting.startTime} - {selectedMeeting.endTime || 'No end time'}
                          </Text>
                        </Box>
                      </HStack>
                      </Box>
                    </Grid>
                    <Box p={3} bg="orange.50" borderRadius="xl" mt={3}>
                      <HStack spacing={3} align="center">
                      <Box
                        p={2}
                          bg="white"
                        borderRadius="lg"
                        color="orange.600"
                          boxShadow="sm"
                      >
                          <FaClock size={12} />
                      </Box>
                      <Box>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                          Duration
                        </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                            {calculateDuration(selectedMeeting.startTime, selectedMeeting.endTime)}
                        </Text>
                      </Box>
                    </HStack>
                    </Box>
                  </Box>
                </VStack>

                {/* Right Column - Customer, Status & Notes */}
                <VStack spacing={0} align="stretch">
                  {/* Customer Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
                    <Flex align="center" gap={4} mb={4}>
                      <Box
                        p={3}
                        bg="purple.50"
                        borderRadius="2xl"
                        color="purple.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaUser size={20} />
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize={{ base: "sm", md: "md", lg: "lg" }} color="gray.800">
                          Customer
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "xs", md: "sm", lg: "md" }} mt={1}>
                          Meeting participant
                        </Text>
                      </Box>
                    </Flex>
                    <VStack spacing={3} align="stretch">
                      <HStack spacing={3} align="center" p={3} bg="gray.50" borderRadius="xl">
                        <Box
                          p={2}
                          bg="white"
                          borderRadius="lg"
                          color="gray.600"
                          boxShadow="sm"
                        >
                          <FaUser size={14} />
                        </Box>
                        <Box flex={1}>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Name
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                            {selectedMeeting.customerName}
                          </Text>
                        </Box>
                      </HStack>
                      <HStack spacing={3} align="center" p={3} bg="gray.50" borderRadius="xl">
                        <Box
                          p={2}
                          bg="white"
                          borderRadius="lg"
                          color="gray.600"
                          boxShadow="sm"
                        >
                          <FaEnvelope size={14} />
                        </Box>
                        <Box flex={1}>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Email
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                            {selectedMeeting.customerEmail}
                          </Text>
                        </Box>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Status Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
                    
                    <Box p={3} bg={`${getStatusColor(selectedMeeting.status)}.50`} borderRadius="xl">
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                          bg="white"
                          borderRadius="lg"
                          color={`${getStatusColor(selectedMeeting.status)}.600`}
                          boxShadow="sm"
                        >
                          {getStatusIcon(selectedMeeting.status)}
                        </Box>
                        <Box flex={1}>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Status
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                            {selectedMeeting.status}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </Box>

                  {/* Notes Section */}
                  {selectedMeeting.notes && (
                    <Box p={{ base: 4, md: 6 }}>
                      <Flex align="center" gap={4} mb={4}>
                        <Box
                          p={3}
                          bg="yellow.50"
                          borderRadius="2xl"
                          color="yellow.600"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <FaStickyNote size={20} />
                        </Box>
                        <Box flex={1}>
                          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md", lg: "lg" }} color="gray.800">
                            Notes
                          </Text>
                          <Text color="gray.600" fontSize={{ base: "xs", md: "sm", lg: "md" }} mt={1}>
                            Additional information
                          </Text>
                        </Box>
                      </Flex>
                      <Box
                        p={4}
                        bg="yellow.50"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="yellow.200"
                      >
                        <Text color="gray.700" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.6">
                          {selectedMeeting.notes}
                        </Text>
                      </Box>
                    </Box>
                  )}
                </VStack>
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyMeetings; 