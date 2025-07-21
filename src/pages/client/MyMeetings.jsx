import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Badge,
  IconButton,
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
} from '@chakra-ui/react';
import { FaEye, FaCalendar, FaMapMarkerAlt, FaClock, FaUser, FaSearch, FaHome, FaEnvelope, FaPhone, FaStickyNote } from 'react-icons/fa';
import { EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import Loader from '../../components/common/Loader';
import { getMyMeetings, formatMeetingDataForFrontend, getMeetingScheduleById } from '../../services/meetings/meetingScheduleService';
import { getPropertyById } from '../../services/propertyService';
import { showErrorToast } from '../../utils/toastUtils';

const MyMeetings = () => {
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const [meetingToView, setMeetingToView] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [counts, setCounts] = useState({
    totalMeetings: 0,
    totalScheduled: 0,
    totalRescheduled: 0,
    totalCompleted: 0,
    totalCancelled: 0
  });

  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  // Fetch meetings on component mount
  useEffect(() => {
    fetchMyMeetings();
  }, []);

  const fetchMyMeetings = async () => {
    setLoading(true);
    try {
      // Get user ID from localStorage
      const authData = localStorage.getItem('auth');
      let userId = null;
      
      if (authData) {
        try {
          const parsedAuth = JSON.parse(authData);
          userId = parsedAuth.data?._id;
          console.log('User ID from localStorage:', userId);
        } catch (error) {
          console.error('Error parsing auth data from localStorage:', error);
        }
      }
      
      if (!userId) {
        showErrorToast('User not found. Please log in again.');
        return;
      }

      const response = await getMyMeetings(userId);
      if (response.data) {
        // Fetch detailed information for each meeting using getMeetingScheduleById
        const detailedMeetings = await Promise.all(
          response.data.map(async (meeting) => {
            try {
              const detailedResponse = await getMeetingScheduleById(meeting._id);
              if (detailedResponse.data) {
                const formattedMeeting = formatMeetingDataForFrontend(detailedResponse.data);
                
                // Fetch property details if propertyId exists
                if (formattedMeeting.propertyId) {
                  try {
                    const propertyResponse = await getPropertyById(formattedMeeting.propertyId);
                    if (propertyResponse.data) {
                      formattedMeeting.propertyData = propertyResponse.data;
                    }
                  } catch (propertyError) {
                    console.error(`Failed to fetch property details for ${formattedMeeting.propertyId}:`, propertyError);
                  }
                }
                
                return formattedMeeting;
              }
              return formatMeetingDataForFrontend(meeting);
            } catch (error) {
              console.error(`Failed to fetch details for meeting ${meeting._id}:`, error);
              return formatMeetingDataForFrontend(meeting);
            }
          })
        );
        
        setMeetings(detailedMeetings);
        
        // Calculate counts
        const totalMeetings = detailedMeetings.length;
        const totalScheduled = detailedMeetings.filter(m => m.statusName === 'Scheduled').length;
        const totalRescheduled = detailedMeetings.filter(m => m.statusName === 'Rescheduled').length;
        const totalCompleted = detailedMeetings.filter(m => m.statusName === 'Completed').length;
        const totalCancelled = detailedMeetings.filter(m => m.statusName === 'Cancelled').length;
        
        setCounts({
          totalMeetings,
          totalScheduled,
          totalRescheduled,
          totalCompleted,
          totalCancelled
        });
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      showErrorToast('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'blue';
      case 'Completed': return 'green';
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
      default: return '��';
    }
  };

  // Calculate duration from start and end time
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '1 hour'; // Default duration
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMinute;
    let endMinutes = endHour * 60 + endMinute;
    
    // If end time is before start time, assume it's the next day
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const totalMinutes = endMinutes - startMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
    }
  };

  // Helper function to get property details (same as MeetingScheduler)
  const getPropertyDetails = (propertyId, propertyData = null) => {
    // If propertyData is provided (populated object), use it directly
    if (propertyData && typeof propertyData === 'object' && propertyData.name) {
      return {
        name: propertyData.name,
        location: `${propertyData.propertyAddress?.area || ''}, ${propertyData.propertyAddress?.city || ''}`,
        price: propertyData.price ? `₹${propertyData.price.toLocaleString()}` : 'N/A'
      };
    }
    
    // If propertyId is an object with populated data, use it directly
    if (propertyId && typeof propertyId === 'object' && propertyId.name) {
      return {
        name: propertyId.name,
        location: `${propertyId.propertyAddress?.area || ''}, ${propertyId.propertyAddress?.city || ''}`,
        price: propertyId.price ? `₹${propertyId.price.toLocaleString()}` : 'N/A'
      };
    }
    
    // If propertyId is a string, we might have fetched property data separately
    if (propertyId && typeof propertyId === 'string') {
      // This will be handled by the propertyData parameter
      return {
        name: 'Property not found',
        location: '',
        price: 'N/A'
      };
    }
    
    // Otherwise, return default values
    return {
      name: 'Property not found',
      location: '',
      price: 'N/A'
    };
  };

  // Memoize filtered meetings
  const filteredMeetings = useMemo(() => {
    let filtered = meetings;
    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.propertyLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.salesPersonName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }
    return filtered;
  }, [meetings, searchTerm, statusFilter]);

  // Reset page when filtered results change
  useEffect(() => {
    const maxPage = Math.ceil(filteredMeetings.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredMeetings.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredMeetings.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleViewDetails = (meeting) => {
    setMeetingToView(meeting);
    onViewOpen();
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
      render: (value, meeting) => {
        const propertyDetails = getPropertyDetails(meeting.propertyId, meeting.propertyData);
        return (
        <Box>
          <Text fontWeight="semibold" color={textColor}>
              {propertyDetails.name}
          </Text>
          <Text fontSize="xs" color={subTextColor}>
              {propertyDetails.location} • {propertyDetails.price}
          </Text>
        </Box>
        );
      }
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
      render: (status, meeting) => {
        const statusName = meeting.statusName || status;
        return (
          <Badge colorScheme={getStatusColor(statusName)} variant="solid">
            {getStatusIcon(statusName)} {statusName}
        </Badge>
        );
      }
    }
  ];

  const renderRowActions = (meeting) => (
    <HStack spacing={2}>
      <IconButton
        icon={<FaEye />}
        size="sm"
        variant="ghost"
        colorScheme="blue"
        onClick={() => handleViewDetails(meeting)}
        aria-label="View meeting"
      />
    </HStack>
  );

  if (loading) {
    return (
      <Box p={5}>
        <Loader size="xl" />
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          My Meetings
        </Heading>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaCalendar color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Meetings</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{counts.totalMeetings}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaCalendar color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Scheduled</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{counts.totalScheduled}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="orange.100" borderRadius="lg">
              <FaCalendar color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Rescheduled</Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.600">{counts.totalRescheduled}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <FaCalendar color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Completed</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">{counts.totalCompleted}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="red.100" borderRadius="lg">
              <FaCalendar color="#ef4444" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Cancelled</Text>
              <Text fontSize="lg" fontWeight="bold" color="red.600">{counts.totalCancelled}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      <HStack spacing={4} mb={6}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search meetings..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </InputGroup>
        <Select
          maxW="200px"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="Filter by status"
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Rescheduled">Rescheduled</option>
        </Select>
      </HStack>

      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredMeetings.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage="No meetings found."
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredMeetings.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredMeetings.length}
        />
      </TableContainer>

      {/* Meeting Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl" isCentered>
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
                  Property Visit Schedule
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
              {meetingToView && (
                <Badge
                  colorScheme={getStatusColor(meetingToView.statusName)}
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
                  {getStatusIcon(meetingToView.statusName)} {meetingToView.statusName}
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
            {meetingToView && (
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
                          {getPropertyDetails(meetingToView.propertyId, meetingToView.propertyData).name}
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
                            {getPropertyDetails(meetingToView.propertyId, meetingToView.propertyData).location}
                          </Text>
                        </Box>
                        <Box
                          as="button"
                          onClick={() => {
                            const location = getPropertyDetails(meetingToView.propertyId, meetingToView.propertyData).location;
                            const encodedLocation = encodeURIComponent(location);
                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
                          }}
                          p={3}
                          borderRadius="lg"
                          bg="white"
                          border="2px solid"
                          borderColor="gray.200"
                          _hover={{ 
                            bg: "gray.50", 
                            borderColor: "gray.300",
                            transform: "scale(1.02)",
                            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                            _before: {
                              left: "100%"
                            }
                          }}
                          _active={{ 
                            bg: "gray.100",
                            transform: "scale(0.98)"
                          }}
                          transition="all 0.2s ease-in-out"
                          cursor="pointer"
                          position="relative"
                          overflow="hidden"
                          _before={{
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                            transition: "left 0.5s"
                          }}
                        >
                          <HStack spacing={{ base: 2, sm: 3, md: 4 }} align="center">
                            <Box
                              p={{ base: 1, sm: 2, md: 3 }}
                              bg="white"
                              borderRadius={{ base: "sm", md: "md" }}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              border="1px solid"
                              borderColor="gray.200"
                            >
                              <Box
                                as="svg"
                                width={{ base: "18px", sm: "20px", md: "22px" }}
                                height={{ base: "18px", sm: "20px", md: "22px" }}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                {/* Green Map Pin with Black Dot */}
                                <path
                                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                  fill="#22C55E"
                                />
                                <path
                                  d="M12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                  fill="#000000"
                                />
                              </Box>
                            </Box>
                            <VStack spacing={0} align="start" display={{ base: "none", sm: "flex" }}>
                              <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.700" fontWeight="bold">
                                View on
                              </Text>
                              <HStack spacing={1} align="center">
                                <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="#4285F4" fontWeight="bold">
                                  G
                                </Text>
                                <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="#EA4335" fontWeight="bold">
                                  o
                                </Text>
                                <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="#FBBC04" fontWeight="bold">
                                  o
                                </Text>
                                <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="#4285F4" fontWeight="bold">
                                  g
                                </Text>
                                <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="#34A853" fontWeight="bold">
                                  l
                                </Text>
                                <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="#EA4335" fontWeight="bold">
                                  e
                                </Text>
                                <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.600" fontWeight="semibold" ml={1}>
                                  Maps
                                </Text>
                              </HStack>
                            </VStack>
                            <Text display={{ base: "block", sm: "none" }} fontSize="xs" color="gray.600" fontWeight="semibold">
                              Map
                      </Text>
                    </HStack>
                        </Box>
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
                            {getPropertyDetails(meetingToView.propertyId, meetingToView.propertyData).price}
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
                          {new Date(meetingToView.meetingDate).toLocaleDateString('en-US', {
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
                              {new Date(meetingToView.meetingDate).toLocaleDateString()}
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
                              {meetingToView.startTime} - {meetingToView.endTime || 'No end time'}
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
                            {calculateDuration(meetingToView.startTime, meetingToView.endTime)}
                        </Text>
                      </Box>
                    </HStack>
                    </Box>
                  </Box>
                </VStack>

                {/* Right Column - Sales Person, Status & Notes */}
                <VStack spacing={0} align="stretch">
                  {/* Sales Person Section */}
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
                          Sales Person
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "xs", md: "sm", lg: "md" }} mt={1}>
                          Your assigned representative
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
                            {meetingToView.salesPersonName}
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
                            {meetingToView.salesPersonEmail}
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
                          <FaPhone size={14} />
                        </Box>
                        <Box flex={1}>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Phone
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                            {meetingToView.salesPersonPhone}
                          </Text>
                        </Box>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Status Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
                    <Flex align="center" gap={4} mb={4}>
                      <Box
                        p={3}
                        bg={`${getStatusColor(meetingToView.statusName)}.50`}
                        borderRadius="2xl"
                        color={`${getStatusColor(meetingToView.statusName)}.600`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {getStatusIcon(meetingToView.statusName)}
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize={{ base: "sm", md: "md", lg: "lg" }} color="gray.800">
                          Status
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "xs", md: "sm", lg: "md" }} mt={1}>
                          Current meeting status
                        </Text>
                      </Box>
                    </Flex>
                    <Box p={3} bg={`${getStatusColor(meetingToView.statusName)}.50`} borderRadius="xl">
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                          bg="white"
                          borderRadius="lg"
                          color={`${getStatusColor(meetingToView.statusName)}.600`}
                          boxShadow="sm"
                    >
                          {getStatusIcon(meetingToView.statusName)}
                        </Box>
                        <Box flex={1}>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Status
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                            {meetingToView.statusName}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </Box>

                  {/* Notes Section */}
                  {meetingToView.notes && (
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
                          {meetingToView.notes}
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

      {/* Removed DeleteConfirmationModal since delete functionality is not available for clients */}
    </Box>
  );
};

export default MyMeetings; 