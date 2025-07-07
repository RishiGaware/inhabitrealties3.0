import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  useDisclosure,
  FormControl,
  VStack,
  HStack,
  Text,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Select,
  Flex,
  Heading,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  Textarea,
  useColorModeValue,
  Grid,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon, CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import { FaEye, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaClock, FaHome, FaEnvelope, FaPhone, FaStickyNote, FaCalendar } from 'react-icons/fa';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import FormModal from '../../components/common/FormModal';
import FloatingInput from '../../components/common/FloatingInput';
import SearchableSelect from '../../components/common/SearchableSelect';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import Loader from '../../components/common/Loader';
import CommonAddButton from '../../components/common/Button/CommonAddButton';

const MeetingScheduler = () => {
  const toast = useToast();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [meetingToView, setMeetingToView] = useState(null);

  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  // Static data implementation - no API calls needed
  
  // Static data for meetings
  const [meetings, setMeetings] = useState([
    {
      _id: '1',
      customerId: 'customer1',
      customerName: 'Ravi Patel',
      customerEmail: 'ravi@example.com',
      customerPhone: '9876543210',
      propertyName: 'Rishi Villa',
      propertyLocation: 'Ahmedabad, Gujarat',
      scheduledDate: '2024-01-15',
      scheduledTime: '10:00',
      duration: 60,
      status: 'Scheduled',
      salesPersonId: 'sales1',
      salesPersonName: 'John Smith',
      notes: 'Customer interested in 3BHK apartment',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      _id: '2',
      customerId: 'customer2',
      customerName: 'Sneha Shah',
      customerEmail: 'sneha@example.com',
      customerPhone: '9876543211',
      propertyName: 'Luxury Apartment',
      propertyLocation: 'Mumbai, Maharashtra',
      scheduledDate: '2024-01-16',
      scheduledTime: '14:00',
      duration: 90,
      status: 'Completed',
      salesPersonId: 'sales2',
      salesPersonName: 'Jane Doe',
      notes: 'Site visit completed successfully',
      createdAt: '2024-01-10T11:00:00Z',
      updatedAt: '2024-01-16T15:00:00Z'
    },
    {
      _id: '3',
      customerId: 'customer3',
      customerName: 'Amit Kumar',
      customerEmail: 'amit@example.com',
      customerPhone: '9876543212',
      propertyName: 'Green Valley',
      propertyLocation: 'Pune, Maharashtra',
      scheduledDate: '2024-01-17',
      scheduledTime: '16:00',
      duration: 60,
      status: 'Cancelled',
      salesPersonId: 'sales1',
      salesPersonName: 'John Smith',
      notes: 'Customer requested cancellation',
      createdAt: '2024-01-10T12:00:00Z',
      updatedAt: '2024-01-16T09:00:00Z'
    },
    {
      _id: '4',
      customerId: 'customer4',
      customerName: 'Priya Sharma',
      customerEmail: 'priya@example.com',
      customerPhone: '9876543213',
      propertyName: 'Sunset Heights',
      propertyLocation: 'Bangalore, Karnataka',
      scheduledDate: '2024-01-18',
      scheduledTime: '11:00',
      duration: 75,
      status: 'Scheduled',
      salesPersonId: 'sales2',
      salesPersonName: 'Jane Doe',
      notes: 'Customer looking for 2BHK with parking',
      createdAt: '2024-01-10T13:00:00Z',
      updatedAt: '2024-01-10T13:00:00Z'
    },
    {
      _id: '5',
      customerId: 'customer5',
      customerName: 'Rajesh Verma',
      customerEmail: 'rajesh@example.com',
      customerPhone: '9876543214',
      propertyName: 'Ocean View',
      propertyLocation: 'Chennai, Tamil Nadu',
      scheduledDate: '2024-01-19',
      scheduledTime: '15:30',
      duration: 60,
      status: 'Rescheduled',
      salesPersonId: 'sales1',
      salesPersonName: 'John Smith',
      notes: 'Meeting rescheduled due to customer request',
      createdAt: '2024-01-10T14:00:00Z',
      updatedAt: '2024-01-18T10:00:00Z'
    }
  ]);

  // Static customer and sales person options for dropdown
  const customerOptions = useMemo(() => [
    { value: 'customer1', label: 'Ravi Patel (ravi@example.com)' },
    { value: 'customer2', label: 'Sneha Shah (sneha@example.com)' },
    { value: 'customer3', label: 'Amit Kumar (amit@example.com)' },
    { value: 'customer4', label: 'Priya Sharma (priya@example.com)' },
    { value: 'customer5', label: 'Rajesh Verma (rajesh@example.com)' },
    { value: 'customer6', label: 'Meera Patel (meera@example.com)' },
    { value: 'customer7', label: 'Vikram Singh (vikram@example.com)' },
    { value: 'customer8', label: 'Anjali Desai (anjali@example.com)' }
  ], []);

  const salesPersonOptions = useMemo(() => [
    { value: 'sales1', label: 'John Smith (john@example.com)' },
    { value: 'sales2', label: 'Jane Doe (jane@example.com)' },
    { value: 'sales3', label: 'Mike Johnson (mike@example.com)' },
    { value: 'sales4', label: 'Sarah Wilson (sarah@example.com)' }
  ], []);

  // Helper functions
  const getCustomerLabel = (customerId) => {
    const customer = customerOptions.find(c => c.value === customerId);
    return customer ? customer.label : customerId;
  };

  const getSalesPersonLabel = (salesPersonId) => {
    const salesPerson = salesPersonOptions.find(s => s.value === salesPersonId);
    return salesPerson ? salesPerson.label : salesPersonId;
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
        meeting.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.salesPersonName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }
    if (customerFilter) {
      filtered = filtered.filter(meeting => meeting.customerId === customerFilter);
    }
    return filtered;
  }, [meetings, searchTerm, statusFilter, customerFilter]);

  // No need to fetch data since we're using static data

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

  const handleAddNew = () => {
    setSelectedMeeting(null);
    setFormData({
      customerId: '',
      propertyName: '',
      propertyLocation: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      salesPersonId: '',
      notes: '',
      status: 'Scheduled'
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = (meeting) => {
    setSelectedMeeting(meeting);
    const data = {
      customerId: meeting.customerId || '',
      propertyName: meeting.propertyName || '',
      propertyLocation: meeting.propertyLocation || '',
      scheduledDate: meeting.scheduledDate || '',
      scheduledTime: meeting.scheduledTime || '',
      duration: meeting.duration || 60,
      salesPersonId: meeting.salesPersonId || '',
      notes: meeting.notes || '',
      status: meeting.status || 'Scheduled'
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
  };

  const handleDelete = (meeting) => {
    setMeetingToDelete(meeting);
    onDeleteOpen();
  };

  const handleView = (meeting) => {
    setMeetingToView(meeting);
    onViewOpen();
  };

  const confirmDelete = async () => {
    if (meetingToDelete && !isApiCallInProgress) {
      setIsApiCallInProgress(true);
      try {
        setMeetings(prev => prev.filter(m => m._id !== meetingToDelete._id));
        toast({
          title: 'Meeting deleted',
          description: 'Meeting has been deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onDeleteClose();
        setMeetingToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete meeting',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsApiCallInProgress(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    if (!formData.propertyName) {
      newErrors.propertyName = 'Property name is required';
    }
    if (!formData.propertyLocation) {
      newErrors.propertyLocation = 'Property location is required';
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Scheduled time is required';
    }
    if (!formData.salesPersonId) {
      newErrors.salesPersonId = 'Sales person is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isApiCallInProgress || isSubmitting) {
      console.log('API call already in progress, ignoring duplicate request');
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      const meetingData = {
        ...formData,
        customerName: getCustomerLabel(formData.customerId),
        salesPersonName: getSalesPersonLabel(formData.salesPersonId),
        createdAt: selectedMeeting ? selectedMeeting.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (selectedMeeting) {
        // Update existing meeting
        setMeetings(prev => prev.map(m => 
          m._id === selectedMeeting._id 
            ? { ...m, ...meetingData, updatedAt: new Date().toISOString() }
            : m
        ));
        toast({
          title: 'Meeting updated',
          description: 'Meeting has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new meeting
        const newMeeting = {
          _id: Date.now().toString(),
          ...meetingData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setMeetings(prev => [...prev, newMeeting]);
        toast({
          title: 'Meeting scheduled',
          description: 'Meeting has been scheduled successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedMeeting(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      toast({
        title: 'Error',
        description: 'Failed to save meeting',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCustomerChange = (value) => {
    setFormData({ ...formData, customerId: value });
    if (errors.customerId) {
      setErrors({ ...errors, customerId: '' });
    }
  };

  const handleSalesPersonChange = (value) => {
    setFormData({ ...formData, salesPersonId: value });
    if (errors.salesPersonId) {
      setErrors({ ...errors, salesPersonId: '' });
    }
  };

  const handleStatusChange = (value) => {
    setFormData({ ...formData, status: value });
  };

  const isFormChanged = () => {
    if (!selectedMeeting || !originalFormData) return true;
    return (
      formData.customerId !== originalFormData.customerId ||
      formData.propertyName !== originalFormData.propertyName ||
      formData.propertyLocation !== originalFormData.propertyLocation ||
      formData.scheduledDate !== originalFormData.scheduledDate ||
      formData.scheduledTime !== originalFormData.scheduledTime ||
      formData.duration !== originalFormData.duration ||
      formData.salesPersonId !== originalFormData.salesPersonId ||
      formData.notes !== originalFormData.notes ||
      formData.status !== originalFormData.status
    );
  };

  const columns = [
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
      label: 'Sales Person' 
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Badge colorScheme={getStatusColor(status)} variant="solid">
          {status}
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
        onClick={() => handleView(meeting)}
        aria-label="View meeting"
      />
      <IconButton
        icon={<EditIcon />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleEdit(meeting)}
        aria-label="Edit meeting"
      />
      <IconButton
        icon={<DeleteIcon />}
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={() => handleDelete(meeting)}
        aria-label="Delete meeting"
      />
    </HStack>
  );

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Meeting Scheduler
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>

      <HStack spacing={4} mb={6}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
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
        <Select
          maxW="200px"
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
          placeholder="Filter by customer"
        >
          {customerOptions.map(customer => (
            <option key={customer.value} value={customer.value}>
              {customer.label}
            </option>
          ))}
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

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedMeeting(null);
          setFormData({});
          setOriginalFormData(null);
          setErrors({});
        }}
        title={selectedMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedMeeting ? 'Update' : 'Schedule'}
        loadingText={selectedMeeting ? 'Updating...' : 'Scheduling...'}
        isDisabled={selectedMeeting ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.customerId}>
            <SearchableSelect
              options={customerOptions}
              value={formData.customerId || ''}
              onChange={handleCustomerChange}
              placeholder="Select customer"
              searchPlaceholder="Search customers..."
              label="Customer"
              error={errors.customerId}
              isRequired={true}
            />
          </FormControl>

          <HStack spacing={4} w="full">
            <FormControl isInvalid={!!errors.propertyName}>
              <FloatingInput
                id="propertyName"
                name="propertyName"
                label="Property Name"
                value={formData.propertyName || ''}
                onChange={handleInputChange}
                error={errors.propertyName}
                required={true}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.propertyLocation}>
              <FloatingInput
                id="propertyLocation"
                name="propertyLocation"
                label="Property Location"
                value={formData.propertyLocation || ''}
                onChange={handleInputChange}
                error={errors.propertyLocation}
                required={true}
              />
            </FormControl>
          </HStack>

          <HStack spacing={4} w="full">
            <FormControl isInvalid={!!errors.scheduledDate}>
              <FloatingInput
                id="scheduledDate"
                name="scheduledDate"
                label="Scheduled Date"
                type="date"
                value={formData.scheduledDate || ''}
                onChange={handleInputChange}
                error={errors.scheduledDate}
                required={true}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.scheduledTime}>
              <FloatingInput
                id="scheduledTime"
                name="scheduledTime"
                label="Scheduled Time"
                type="time"
                value={formData.scheduledTime || ''}
                onChange={handleInputChange}
                error={errors.scheduledTime}
                required={true}
              />
            </FormControl>
            <FormControl>
              <FloatingInput
                id="duration"
                name="duration"
                label="Duration (minutes)"
                type="number"
                value={formData.duration || 60}
                onChange={handleInputChange}
                min={15}
                max={480}
              />
            </FormControl>
          </HStack>

          <FormControl isInvalid={!!errors.salesPersonId}>
            <SearchableSelect
              options={salesPersonOptions}
              value={formData.salesPersonId || ''}
              onChange={handleSalesPersonChange}
              placeholder="Select sales person"
              searchPlaceholder="Search sales persons..."
              label="Sales Person"
              error={errors.salesPersonId}
              isRequired={true}
            />
          </FormControl>

          {selectedMeeting && (
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status || 'Scheduled'}
                onChange={handleStatusChange}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </Select>
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              placeholder="Add meeting notes..."
              rows={3}
            />
          </FormControl>
        </VStack>
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Meeting"
        message={`Are you sure you want to delete the meeting with ${meetingToDelete?.customerName}?`}
      />

      {/* Meeting View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="6xl" isCentered>
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
            {meetingToView && (
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
                          {meetingToView.propertyName}
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
                        {meetingToView.propertyLocation}
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
                          {new Date(meetingToView.scheduledDate).toLocaleDateString('en-US', {
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
                            {new Date(meetingToView.scheduledDate).toLocaleDateString()}
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
                            {meetingToView.scheduledTime}
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
                          {meetingToView.duration} minutes
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
                            {meetingToView.salesPersonName}
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
                            {meetingToView.salesPersonEmail}
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
                            {meetingToView.salesPersonPhone}
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
                        bg={`${getStatusColor(meetingToView.status)}.50`}
                        borderRadius="xl"
                        color={`${getStatusColor(meetingToView.status)}.600`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {getStatusIcon(meetingToView.status)}
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
                      colorScheme={getStatusColor(meetingToView.status)}
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
                      {getStatusIcon(meetingToView.status)} {meetingToView.status}
                    </Badge>
                  </Box>

                  {/* Notes Section */}
                  {meetingToView.notes && (
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
                          {meetingToView.notes}
                        </Text>
                      </Box>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box p={{ base: 4, md: 6 }} borderTop="1px solid" borderColor="gray.100">
                    <HStack spacing={4} justify="center">
                      <Button
                        leftIcon={<EditIcon />}
                        colorScheme="brand"
                        variant="solid"
                        borderRadius="lg"
                        size="md"
                        fontWeight="bold"
                        onClick={() => {
                          onViewClose();
                          handleEdit(meetingToView);
                        }}
                      >
                        Edit Meeting
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MeetingScheduler; 