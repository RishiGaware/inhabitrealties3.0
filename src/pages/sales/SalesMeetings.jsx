import React, { useState, useMemo } from 'react';
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
  Button,
} from '@chakra-ui/react';
import { FaEye, FaCalendar, FaMapMarkerAlt, FaClock, FaUser, FaSearch, FaHome, FaEnvelope, FaPhone, FaStickyNote, FaPlus } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import CommonAddButton from '../../components/common/Button/CommonAddButton';

const SalesMeetings = () => {
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

  // Static data for sales meetings
  const staticMeetings = [
    {
      id: 1,
      title: "Property Viewing - 2BHK Apartment",
      description: "Young couple looking for their first home",
      customerName: "Rahul & Priya Sharma",
      customerEmail: "rahul.priya@email.com",
      propertyName: "Green Valley Apartments",
      propertyLocation: "Thane West, Mumbai",
      propertyPrice: "₹1.2 Cr",
      meetingDate: "2024-01-15",
      startTime: "11:00",
      endTime: "12:00",
      status: "Scheduled",
      salesPersonName: "Neha Singh",
      salesPersonEmail: "neha.singh@inhabit.com",
      salesPersonPhone: "+91 98765 43212",
      location: "Property Site - Thane West",
      notes: "First-time buyers. Show them the amenities and explain the loan process."
    },
    {
      id: 2,
      title: "Investment Property Discussion",
      description: "Business owner looking for rental property",
      customerName: "Vikram Mehta",
      customerEmail: "vikram.mehta@email.com",
      propertyName: "Commercial Complex",
      propertyLocation: "Andheri East, Mumbai",
      propertyPrice: "₹3.5 Cr",
      meetingDate: "2024-01-16",
      startTime: "15:00",
      endTime: "16:30",
      status: "Completed",
      salesPersonName: "Arjun Reddy",
      salesPersonEmail: "arjun.reddy@inhabit.com",
      salesPersonPhone: "+91 98765 43214",
      location: "Office - Andheri Branch",
      notes: "Client interested in rental yield. Prepare ROI analysis and rental agreements."
    },
    {
      id: 3,
      title: "Luxury Villa Tour",
      description: "High net worth individual",
      customerName: "Raj Malhotra",
      customerEmail: "raj.malhotra@email.com",
      propertyName: "Luxury Villa Complex",
      propertyLocation: "Bandra West, Mumbai",
      propertyPrice: "₹4.8 Cr",
      meetingDate: "2024-01-17",
      startTime: "14:00",
      endTime: "15:30",
      status: "Rescheduled",
      salesPersonName: "Sarah Johnson",
      salesPersonEmail: "sarah.johnson@inhabit.com",
      salesPersonPhone: "+91 98765 43210",
      location: "Property Site - Bandra West",
      notes: "Rescheduled due to client's travel plans. New time confirmed for next week."
    },
    {
      id: 4,
      title: "Office Space Discussion",
      description: "Startup looking for office space",
      customerName: "Amit & Meera Patel",
      customerEmail: "amit.meera@email.com",
      propertyName: "Business Park",
      propertyLocation: "BKC, Mumbai",
      propertyPrice: "₹2.1 Cr",
      meetingDate: "2024-01-18",
      startTime: "10:00",
      endTime: "11:00",
      status: "Scheduled",
      salesPersonName: "Rahul Sharma",
      salesPersonEmail: "rahul.sharma@inhabit.com",
      salesPersonPhone: "+91 98765 43211",
      location: "Office - BKC Branch",
      notes: "Startup with 15 employees. Need flexible lease terms and parking space."
    },
    {
      id: 5,
      title: "Residential Plot Discussion",
      description: "Family planning to build their dream home",
      customerName: "Sunil & Rekha Iyer",
      customerEmail: "sunil.rekha@email.com",
      propertyName: "Residential Plots",
      propertyLocation: "Navi Mumbai",
      propertyPrice: "₹1.8 Cr",
      meetingDate: "2024-01-19",
      startTime: "16:00",
      endTime: "17:00",
      status: "Cancelled",
      salesPersonName: "Vikram Mehta",
      salesPersonEmail: "vikram.mehta@inhabit.com",
      salesPersonPhone: "+91 98765 43213",
      location: "Property Site - Navi Mumbai",
      notes: "Cancelled due to client's personal emergency. Will reschedule when convenient."
    }
  ];

  // Calculate counts
  const counts = {
    totalMeetings: staticMeetings.length,
    totalScheduled: staticMeetings.filter(m => m.status === 'Scheduled').length,
    totalRescheduled: staticMeetings.filter(m => m.status === 'Rescheduled').length,
    totalCompleted: staticMeetings.filter(m => m.status === 'Completed').length,
    totalCancelled: staticMeetings.filter(m => m.status === 'Cancelled').length
  };

  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

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

  // Calculate duration from start and end time
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '1 hour';
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMinute;
    let endMinutes = endHour * 60 + endMinute;
    
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

  // Memoize filtered meetings
  const filteredMeetings = useMemo(() => {
    let filtered = staticMeetings;
    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }
    return filtered;
  }, [searchTerm, statusFilter]);

  // Reset page when filtered results change
  React.useEffect(() => {
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
      render: (status, meeting) => (
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
        variant="ghost"
        colorScheme="blue"
        onClick={() => handleViewDetails(meeting)}
        aria-label="View meeting"
      />
    </HStack>
  );

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Sales Meetings
        </Heading>
        <CommonAddButton onClick={() => console.log('Add new meeting')} />
      </Flex>

      {/* Summary Cards */}
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
            <Text color="white" fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" textAlign="center" noOfLines={1}>
              TOTAL MEETINGS
            </Text>
            <Text color="white" fontSize={{ base: "xl", sm: "2xl" }} fontWeight="bold" textAlign="center">
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
            <Text color="white" fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" textAlign="center" noOfLines={1}>
              SCHEDULED
            </Text>
            <Text color="white" fontSize={{ base: "xl", sm: "2xl" }} fontWeight="bold" textAlign="center">
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
            <Text color="white" fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" textAlign="center" noOfLines={1}>
              RESCHEDULED
            </Text>
            <Text color="white" fontSize={{ base: "xl", sm: "2xl" }} fontWeight="bold" textAlign="center">
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
            <Text color="white" fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" textAlign="center" noOfLines={1}>
              COMPLETED
            </Text>
            <Text color="white" fontSize={{ base: "xl", sm: "2xl" }} fontWeight="bold" textAlign="center">
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
            <Text color="white" fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" textAlign="center" noOfLines={1}>
              CANCELLED
            </Text>
            <Text color="white" fontSize={{ base: "xl", sm: "2xl" }} fontWeight="bold" textAlign="center">
              {counts.totalCancelled}
            </Text>
          </VStack>
        </Box>
      </Grid>

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
              onChange={handleSearch}
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
                    Sales Meeting Management
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
                  colorScheme={getStatusColor(meetingToView.status)}
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
                  {getStatusIcon(meetingToView.status)} {meetingToView.status}
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
                          {meetingToView.propertyName}
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
                            {meetingToView.propertyLocation}
                          </Text>
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
                            {meetingToView.propertyPrice}
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
                          Assigned representative
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
                        bg={`${getStatusColor(meetingToView.status)}.50`}
                        borderRadius="2xl"
                        color={`${getStatusColor(meetingToView.status)}.600`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {getStatusIcon(meetingToView.status)}
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
                    <Box p={3} bg={`${getStatusColor(meetingToView.status)}.50`} borderRadius="xl">
                      <HStack spacing={3} align="center">
                        <Box
                          p={2}
                          bg="white"
                          borderRadius="lg"
                          color={`${getStatusColor(meetingToView.status)}.600`}
                          boxShadow="sm"
                        >
                          {getStatusIcon(meetingToView.status)}
                        </Box>
                        <Box flex={1}>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                            Status
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="semibold">
                            {meetingToView.status}
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
    </Box>
  );
};

export default SalesMeetings; 