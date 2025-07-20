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
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import Loader from '../../components/common/Loader';
import { getMyMeetings, formatMeetingDataForFrontend } from '../../services/meetings/meetingScheduleService';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

const MyMeetings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [counts, setCounts] = useState({
    totalMeetings: 0,
    totalScheduled: 0,
    totalCompleted: 0,
    totalCancelled: 0
  });

  const { getUserId } = useAuth();

  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch meetings on component mount
  useEffect(() => {
    fetchMyMeetings();
  }, []);

  const fetchMyMeetings = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        showErrorToast('User not found');
        return;
      }

      const response = await getMyMeetings(userId);
      if (response.data) {
        const formattedMeetings = response.data.map(formatMeetingDataForFrontend);
        setMeetings(formattedMeetings);
        
        // Calculate counts
        const totalMeetings = formattedMeetings.length;
        const totalScheduled = formattedMeetings.filter(m => m.status === 'Scheduled').length;
        const totalCompleted = formattedMeetings.filter(m => m.status === 'Completed').length;
        const totalCancelled = formattedMeetings.filter(m => m.status === 'Cancelled').length;
        
        setCounts({
          totalMeetings,
          totalScheduled,
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
      default: return '📋';
    }
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
    setSelectedMeeting(meeting);
    onOpen();
  };

  const columns = [
    { 
      key: 'propertyName', 
      label: 'Property',
      render: (value, meeting) => (
        <Box>
          <Text fontWeight="semibold" color={textColor}>{value}</Text>
          <Text fontSize="xs" color={subTextColor}>{meeting.propertyLocation}</Text>
        </Box>
      )
    },
    { 
      key: 'scheduledDate', 
      label: 'Date & Time',
      render: (value, meeting) => (
        <Box>
          <Text fontWeight="semibold" color={textColor}>
            {new Date(meeting.scheduledDate).toLocaleDateString()}
          </Text>
          <Text fontSize="xs" color={subTextColor}>
            {meeting.scheduledTime} ({meeting.duration} min)
          </Text>
        </Box>
      )
    },
    { 
      key: 'salesPersonName', 
      label: 'Sales Person',
      render: (value, meeting) => (
        <Box>
          <Text fontWeight="semibold" color={textColor}>{value}</Text>
          <Text fontSize="xs" color={subTextColor}>{meeting.salesPersonEmail}</Text>
        </Box>
      )
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

  const renderRowActions = (meeting) => (
    <HStack spacing={2}>
      <IconButton
        icon={<FaEye />}
        size="sm"
        variant="outline"
        colorScheme="blue"
        onClick={() => handleViewDetails(meeting)}
        aria-label="View meeting details"
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
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
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
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="2xl"
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
          maxW={{ base: "95vw", sm: "90vw", md: "80vw", lg: "1200px" }}
          mx={4}
          overflow="hidden"
          minH={{ base: "80vh", md: "70vh" }}
        >
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            p={6}
            position="relative"
            overflow="hidden"
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
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text color="white" fontSize="2xl" fontWeight="bold">
                  Meeting Details
                </Text>
                <Text color="white" opacity="0.9" fontSize="sm">
                  Property Visit Schedule
                </Text>
              </VStack>
              <Box
                p={3}
                bg="white"
                borderRadius="full"
                opacity="0.2"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FaCalendar size={24} color="white" />
              </Box>
            </Flex>
          </Box>
          <ModalCloseButton
            color="white"
            bg="rgba(255,255,255,0.2)"
            borderRadius="full"
            _hover={{ bg: "rgba(255,255,255,0.3)" }}
            top={4}
            right={4}
          />
          <ModalBody p={0}>
            {selectedMeeting && (
              <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={0}>
                {/* Left Column - Property & Schedule */}
                <VStack spacing={0} align="stretch">
                  {/* Property Details Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
                    <Flex align="center" gap={3} mb={4}>
                      <Box
                        p={3}
                        bg="blue.50"
                        borderRadius="xl"
                        color="blue.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaHome size={20} />
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                          Property Details
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} mt={1}>
                          {selectedMeeting.propertyName}
                        </Text>
                      </Box>
                    </Flex>
                    <HStack spacing={3} align="center">
                      <Box
                        p={2}
                        bg="gray.50"
                        borderRadius="lg"
                        color="gray.600"
                      >
                        <FaMapMarkerAlt size={16} />
                      </Box>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        {selectedMeeting.propertyLocation}
                      </Text>
                    </HStack>
                  </Box>

                  {/* Schedule Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom={{ base: "1px solid", lg: "none" }} borderColor="gray.100">
                    <Flex align="center" gap={3} mb={4}>
                      <Box
                        p={3}
                        bg="green.50"
                        borderRadius="xl"
                        color="green.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaClock size={20} />
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                          Schedule
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} mt={1}>
                          {new Date(selectedMeeting.scheduledDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </Box>
                    </Flex>
                    <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                          bg="blue.50"
                          borderRadius="lg"
                          color="blue.600"
                        >
                          <FaCalendar size={14} />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            Date
                          </Text>
                          <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                            {new Date(selectedMeeting.scheduledDate).toLocaleDateString()}
                          </Text>
                        </Box>
                      </HStack>
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                          bg="purple.50"
                          borderRadius="lg"
                          color="purple.600"
                        >
                          <FaClock size={14} />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            Time
                          </Text>
                          <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                            {selectedMeeting.scheduledTime}
                          </Text>
                        </Box>
                      </HStack>
                    </Grid>
                    <HStack spacing={3} align="center" mt={3}>
                      <Box
                        p={2}
                        bg="orange.50"
                        borderRadius="lg"
                        color="orange.600"
                      >
                        <FaClock size={14} />
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500" fontWeight="medium">
                          Duration
                        </Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                          {selectedMeeting.duration} minutes
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>

                {/* Right Column - Sales Person, Status & Notes */}
                <VStack spacing={0} align="stretch">
                  {/* Sales Person Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
                    <Flex align="center" gap={3} mb={4}>
                      <Box
                        p={3}
                        bg="purple.50"
                        borderRadius="xl"
                        color="purple.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaUser size={20} />
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                          Sales Person
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} mt={1}>
                          Your assigned representative
                        </Text>
                      </Box>
                    </Flex>
                    <VStack spacing={3} align="stretch">
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                          bg="gray.50"
                          borderRadius="lg"
                          color="gray.600"
                        >
                          <FaUser size={14} />
                        </Box>
                        <Box flex={1}>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            Name
                          </Text>
                          <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                            {selectedMeeting.salesPersonName}
                          </Text>
                        </Box>
                      </HStack>
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                          bg="gray.50"
                          borderRadius="lg"
                          color="gray.600"
                        >
                          <FaEnvelope size={14} />
                        </Box>
                        <Box flex={1}>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            Email
                          </Text>
                          <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                            {selectedMeeting.salesPersonEmail}
                          </Text>
                        </Box>
                      </HStack>
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                          bg="gray.50"
                          borderRadius="lg"
                          color="gray.600"
                        >
                          <FaPhone size={14} />
                        </Box>
                        <Box flex={1}>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            Phone
                          </Text>
                          <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                            {selectedMeeting.salesPersonPhone}
                          </Text>
                        </Box>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Status Section */}
                  <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.100">
                    <Flex align="center" gap={3} mb={4}>
                      <Box
                        p={3}
                        bg={`${getStatusColor(selectedMeeting.status)}.50`}
                        borderRadius="xl"
                        color={`${getStatusColor(selectedMeeting.status)}.600`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {getStatusIcon(selectedMeeting.status)}
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                          Status
                        </Text>
                        <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} mt={1}>
                          Current meeting status
                        </Text>
                      </Box>
                    </Flex>
                    <Badge
                      colorScheme={getStatusColor(selectedMeeting.status)}
                      variant="solid"
                      fontSize="md"
                      px={4}
                      py={2}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap={2}
                      w="fit-content"
                    >
                      {getStatusIcon(selectedMeeting.status)} {selectedMeeting.status}
                    </Badge>
                  </Box>

                  {/* Notes Section */}
                  {selectedMeeting.notes && (
                    <Box p={{ base: 4, md: 6 }}>
                      <Flex align="center" gap={3} mb={4}>
                        <Box
                          p={3}
                          bg="yellow.50"
                          borderRadius="xl"
                          color="yellow.600"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <FaStickyNote size={20} />
                        </Box>
                        <Box flex={1}>
                          <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                            Notes
                          </Text>
                          <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} mt={1}>
                            Additional information
                          </Text>
                        </Box>
                      </Flex>
                      <Box
                        p={4}
                        bg="yellow.50"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="yellow.200"
                      >
                        <Text color="gray.700" fontSize="sm" lineHeight="1.6">
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