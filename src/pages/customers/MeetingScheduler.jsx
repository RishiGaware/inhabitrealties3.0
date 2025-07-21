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
import CommonCard from '../../components/common/Card/CommonCard';
import { 
  fetchAllMeetingSchedules, 
  createMeetingSchedule, 
  updateMeetingSchedule, 
  deleteMeetingSchedule,
  formatMeetingDataForAPI,
  formatMeetingDataForFrontend,
  getMeetingScheduleById
} from '../../services/meetings/meetingScheduleService';
import { fetchAllMeetingScheduleStatuses } from '../../services/meetings/meetingScheduleStatusService';
import { fetchProperties } from '../../services/propertyService';
import { useUserContext } from '../../context/UserContext';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

const MeetingScheduler = () => {
  const { users, getAllUsers } = useUserContext();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [counts, setCounts] = useState({
    totalMeetings: 0,
    totalScheduled: 0,
    totalRescheduled: 0,
    totalCancelled: 0,
    totalCompleted: 0
  });
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
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  // Customer and sales person options from real user data
  const customerOptions = useMemo(() => {
    // For now, let's include all users as potential customers
    // You'll need to create proper role-based filtering based on your role system
    return users.map(user => ({
      value: user._id,
      label: `${user.firstName} ${user.lastName} (${user.email})`
    }));
  }, [users]);

  // Property options for dropdown
  const propertyOptions = useMemo(() => {
    return properties.map(property => ({
      value: property._id,
      label: `${property.name} - ${property.propertyAddress?.area || ''}, ${property.propertyAddress?.city || ''} (₹${property.price?.toLocaleString() || 'N/A'})`
    }));
  }, [properties]);

  // Status options from real API data
  const statusOptions = useMemo(() => {
    console.log('Statuses available:', statuses);
    if (statuses.length === 0) {
      console.warn('No meeting statuses available. Please create meeting statuses in the admin panel.');
      return [];
    }
    const options = statuses.map(status => ({
      value: status._id,
      label: status.name
    }));
    console.log('Status options:', options);
    return options;
  }, [statuses]);

  // Fetch meetings, properties, users, and statuses on component mount
  useEffect(() => {
    fetchMeetings();
    fetchAllProperties();
    fetchAllStatuses();
    getAllUsers();
  }, [getAllUsers]);

  // Debug: Log users and their roles
  useEffect(() => {
    console.log('Available users:', users);
    console.log('User roles:', users.map(user => ({ 
      id: user._id, 
      name: `${user.firstName} ${user.lastName}`, 
      role: user.role 
    })));
    console.log('Users with customer role:', users.filter(user => user.role === 'customer' || user.role === 'client'));
    console.log('Users with sales role:', users.filter(user => user.role === 'sales' || user.role === 'agent' || user.role === 'admin'));
  }, [users]);

  // Debug: Log statuses
  useEffect(() => {
    console.log('Available statuses:', statuses);
  }, [statuses]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await fetchAllMeetingSchedules();
      if (response.data) {
        const formattedMeetings = response.data.map(formatMeetingDataForFrontend);
        console.log('Formatted meetings:', formattedMeetings);
        setMeetings(formattedMeetings);
        
        // Calculate counts
        const totalMeetings = formattedMeetings.length;
        const totalScheduled = formattedMeetings.filter(m => m.statusName === 'Scheduled').length;
        const totalRescheduled = formattedMeetings.filter(m => m.statusName === 'Rescheduled').length;
        const totalCancelled = formattedMeetings.filter(m => m.statusName === 'Cancelled').length;
        const totalCompleted = formattedMeetings.filter(m => m.statusName === 'Completed').length;
        
        setCounts({
          totalMeetings,
          totalScheduled,
          totalRescheduled,
          totalCancelled,
          totalCompleted
        });
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      showErrorToast('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProperties = async () => {
    setPropertiesLoading(true);
    try {
      const response = await fetchProperties();
      setProperties(response.data || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      showErrorToast('Failed to load properties');
    } finally {
      setPropertiesLoading(false);
    }
  };

  const fetchAllStatuses = async () => {
    try {
      console.log('Fetching meeting statuses...');
      const response = await fetchAllMeetingScheduleStatuses();
      console.log('Meeting statuses response:', response);
      setStatuses(response.data || []);
      console.log('Statuses set to state:', response.data || []);
    } catch (error) {
      console.error('Failed to fetch statuses:', error);
      showErrorToast('Failed to load meeting statuses');
    }
  };

  // Helper functions
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
    
    // Otherwise, find the property in the properties array
    const property = properties.find(p => p._id === propertyId);
    if (!property) return { name: 'Property not found', location: '', price: '' };
    
    return {
      name: property.name,
      location: `${property.propertyAddress?.area || ''}, ${property.propertyAddress?.city || ''}`,
      price: property.price ? `₹${property.price.toLocaleString()}` : 'N/A'
    };
  };

  const getStatusName = (statusId) => {
    const status = statuses.find(s => s._id === statusId);
    return status ? status.name : 'Unknown';
  };

  const getStatusColor = (statusName) => {
    switch (statusName) {
      case 'Scheduled': return 'blue';
      case 'Completed': return 'green';
      case 'Cancelled': return 'red';
      case 'Rescheduled': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusIcon = (statusName) => {
    switch (statusName) {
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
        meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(meeting => {
        const meetingStatusName = meeting.statusName || getStatusName(meeting.status);
        return meetingStatusName === statusFilter;
      });
    }
    if (customerFilter) {
      filtered = filtered.filter(meeting => meeting.customerId === customerFilter);
    }
    return filtered;
  }, [meetings, searchTerm, statusFilter, customerFilter, statuses]);

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
    const defaultStatus = statusOptions.length > 0 ? statusOptions[0].value : '';
    setFormData({
      title: '',
      description: '',
      customerId: '',
      propertyId: '',
      meetingDate: '',
      startTime: '',
      endTime: '',
      location: '',
      status: defaultStatus,
      notes: ''
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = async (meeting) => {
    try {
      setLoading(true);
      console.log('Fetching meeting details for edit:', meeting._id);
      
      // Fetch complete meeting data by ID
      const response = await getMeetingScheduleById(meeting._id);
      console.log('Fetched meeting data:', response);
      
      if (!response.data) {
        showErrorToast('Failed to fetch meeting details');
        return;
      }
      
      // Format the fetched data for frontend
      const formattedMeeting = formatMeetingDataForFrontend(response.data);
      console.log('Formatted meeting data:', formattedMeeting);
      
      setSelectedMeeting(formattedMeeting);
      
      // Convert ISO date string to yyyy-MM-dd format for the date input
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      console.log('Editing meeting:', formattedMeeting);
      console.log('Meeting status:', formattedMeeting.status);
      console.log('Available status options:', statusOptions);
      
    const data = {
        title: formattedMeeting.title || '',
        description: formattedMeeting.description || '',
        customerId: formattedMeeting.customerId || '',
        propertyId: formattedMeeting.propertyId || '',
        meetingDate: formatDateForInput(formattedMeeting.meetingDate) || '',
        startTime: formattedMeeting.startTime || '',
        endTime: formattedMeeting.endTime || '',
        location: formattedMeeting.location || '',
        status: formattedMeeting.status || (statusOptions.length > 0 ? statusOptions[0].value : ''),
        notes: formattedMeeting.notes || ''
      };
      
      console.log('Setting form data:', data);
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      showErrorToast('Failed to fetch meeting details');
    } finally {
      setLoading(false);
    }
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
    if (meetingToDelete && !isApiCallInProgress && !isDeleteLoading) {
      setIsApiCallInProgress(true);
      setIsDeleteLoading(true);
      try {
        await deleteMeetingSchedule(meetingToDelete._id);
        showSuccessToast('Meeting deleted successfully');
        fetchMeetings(); // Refresh the list and recalculate counts
        onDeleteClose();
        setMeetingToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
        showErrorToast('Failed to delete meeting');
      } finally {
        setIsApiCallInProgress(false);
        setIsDeleteLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check if we have required data loaded
    if (customerOptions.length === 0) {
      newErrors.general = 'No customers available. Please ensure users are created with customer role.';
    }
    if (statusOptions.length === 0) {
      newErrors.general = 'No meeting statuses available. Please ensure meeting statuses are created.';
    }
    if (propertyOptions.length === 0) {
      newErrors.general = 'No properties available. Please ensure properties are created.';
    }
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    if (!formData.propertyId) {
      newErrors.propertyId = 'Property is required';
    }
    if (!formData.meetingDate) {
      newErrors.meetingDate = 'Meeting date is required';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isApiCallInProgress || isSubmitting) {
      console.log('API call already in progress, ignoring duplicate request');
      return;
    }
    
    if (!validateForm()) return;

    // Debug: Log the form data being sent
    console.log('Form data being sent:', formData);
    console.log('Customer options:', customerOptions);
    console.log('Status options:', statusOptions);
    console.log('Users:', users);

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      // Calculate duration from start and end time (in minutes for API)
      const startTime = formData.startTime;
      const endTime = formData.endTime;
      
      let durationMinutes = 60; // Default duration
      if (startTime && endTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        let startMinutes = startHour * 60 + startMinute;
        let endMinutes = endHour * 60 + endMinute;
        
        // If end time is before start time, assume it's the next day
        if (endMinutes < startMinutes) {
          endMinutes += 24 * 60;
        }
        
        durationMinutes = endMinutes - startMinutes;
      }
      
      const apiData = formatMeetingDataForAPI({
        ...formData,
        duration: durationMinutes
      });
      console.log('API data being sent:', apiData);

      if (selectedMeeting) {
        // Update existing meeting
        await updateMeetingSchedule(selectedMeeting._id, apiData);
        showSuccessToast('Meeting updated successfully');
      } else {
        // Add new meeting
        await createMeetingSchedule(apiData);
        showSuccessToast('Meeting scheduled successfully');
      }
      
      fetchMeetings(); // Refresh the list and recalculate counts
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedMeeting(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      showErrorToast('Failed to save meeting');
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

  const handlePropertyChange = (value) => {
    setFormData({ ...formData, propertyId: value });
    if (errors.propertyId) {
      setErrors({ ...errors, propertyId: '' });
    }
  };

  const handleStatusChange = (value) => {
    console.log('Status change triggered with value:', value);
    console.log('Previous formData.status:', formData.status);
    setFormData(prev => {
      const newFormData = { ...prev, status: value };
      console.log('New formData:', newFormData);
      return newFormData;
    });
    if (errors.status) {
      setErrors(prev => ({ ...prev, status: '' }));
    }
  };

  const isFormChanged = () => {
    if (!selectedMeeting || !originalFormData) return true;
    
    const hasChanged = (
      formData.title !== originalFormData.title ||
      formData.description !== originalFormData.description ||
      formData.customerId !== originalFormData.customerId ||
      formData.propertyId !== originalFormData.propertyId ||
      formData.meetingDate !== originalFormData.meetingDate ||
      formData.startTime !== originalFormData.startTime ||
      formData.endTime !== originalFormData.endTime ||
      formData.location !== originalFormData.location ||
      formData.status !== originalFormData.status ||
      formData.notes !== originalFormData.notes
    );
    
    console.log('Form change check:', {
      currentStatus: formData.status,
      originalStatus: originalFormData.status,
      statusChanged: formData.status !== originalFormData.status,
      hasChanged
    });
    
    return hasChanged;
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
        const statusName = meeting.statusName || getStatusName(status);
        return (
          <Badge colorScheme={getStatusColor(statusName)} variant="solid">
            {statusName}
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
      {/* Loader at the top, non-blocking */}
      {loading && <Loader size="xl" />}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Meeting Scheduler
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
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
              <FaCalendar color="#f97316" size={20} />
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

      {/* Debug information */}
      {users.length === 0 && (
        <Box p={4} bg="yellow.50" border="1px solid" borderColor="yellow.200" borderRadius="md" mb={4}>
          <Text color="yellow.800" fontSize="sm">
            ⚠️ No users available. Please create users first.
          </Text>
        </Box>
      )}

      {statuses.length === 0 && (
        <Box p={4} bg="orange.50" border="1px solid" borderColor="orange.200" borderRadius="md" mb={4}>
          <Text color="orange.800" fontSize="sm">
            ⚠️ No meeting statuses available. Please create meeting statuses in the admin panel.
          </Text>
        </Box>
      )}

      {properties.length === 0 && (
        <Box p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="md" mb={4}>
          <Text color="red.800" fontSize="sm">
            ⚠️ No properties available. Please create properties first.
          </Text>
        </Box>
      )}

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
          isDisabled={statusOptions.length === 0}
        >
          {console.log('Rendering status filter with options:', statusOptions)}
          {statusOptions.length === 0 ? (
            <option value="" disabled>No statuses available</option>
          ) : (
            statusOptions.map(status => (
              <option key={status.value} value={status.label}>
                {status.label}
              </option>
            ))
          )}
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
          emptyStateMessage={!loading ? "No meetings found." : undefined}
        />
        {console.log('Displaying meetings in table:', filteredMeetings.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        ))}
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
          {errors.general && (
            <Box
              p={4}
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="md"
              w="full"
            >
              <Text color="red.600" fontSize="sm">
                {errors.general}
              </Text>
            </Box>
          )}

          <FormControl isInvalid={!!errors.title}>
            <FloatingInput
              id="title"
              name="title"
              label="Meeting Title"
              value={formData.title || ''}
              onChange={handleInputChange}
              error={errors.title}
              required={true}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Enter meeting description..."
              rows={3}
            />
          </FormControl>

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

          <FormControl isInvalid={!!errors.propertyId}>
            <SearchableSelect
              options={propertyOptions}
              value={formData.propertyId || ''}
              onChange={handlePropertyChange}
              placeholder={propertiesLoading ? "Loading properties..." : "Select property"}
              searchPlaceholder="Search properties..."
              label="Property"
              error={errors.propertyId}
              isRequired={true}
              isDisabled={propertiesLoading}
              />
            </FormControl>

          <HStack spacing={4} w="full">
            <FormControl isInvalid={!!errors.meetingDate}>
              <FloatingInput
                id="meetingDate"
                name="meetingDate"
                label="Meeting Date"
                type="date"
                value={formData.meetingDate || ''}
                onChange={handleInputChange}
                error={errors.meetingDate}
                required={true}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.startTime}>
              <FloatingInput
                id="startTime"
                name="startTime"
                label="Start Time"
                type="time"
                value={formData.startTime || ''}
                onChange={handleInputChange}
                error={errors.startTime}
                required={true}
              />
            </FormControl>
            <FormControl>
              <FloatingInput
                id="endTime"
                name="endTime"
                label="End Time"
                type="time"
                value={formData.endTime || ''}
                onChange={handleInputChange}
              />
            </FormControl>
          </HStack>

          {/* Show calculated duration */}
          {formData.startTime && formData.endTime && (
            <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
              <Text fontSize="sm" color="blue.700" fontWeight="medium">
                📅 Duration: {calculateDuration(formData.startTime, formData.endTime)}
              </Text>
            </Box>
          )}

          <HStack spacing={4} w="full">
            <FormControl isInvalid={!!errors.location}>
              <FloatingInput
                id="location"
                name="location"
                label="Location"
                value={formData.location || ''}
                onChange={handleInputChange}
                error={errors.location}
                required={true}
            />
          </FormControl>
          </HStack>

          <FormControl isInvalid={!!errors.status}>
              <FormLabel>Status</FormLabel>
              <Select
              value={formData.status || ''}
              onChange={(e) => {
                console.log('Status dropdown onChange triggered with value:', e.target.value);
                handleStatusChange(e.target.value);
              }}
              placeholder={statusOptions.length === 0 ? "No statuses available" : "Select status"}
              isDisabled={statusOptions.length === 0}
            >
              {console.log('Rendering status dropdown with options:', statusOptions, 'current value:', formData.status)}
              {statusOptions.length === 0 ? (
                <option value="" disabled>No statuses available</option>
              ) : (
                statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
              </Select>
            {errors.status && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.status}
              </Text>
            )}
            {statusOptions.length === 0 && (
              <Text color="orange.500" fontSize="sm" mt={1}>
                ⚠️ No meeting statuses available. Please create statuses in the admin panel.
              </Text>
            )}
          </FormControl>

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
        isLoading={isDeleteLoading}
        loadingText="Deleting..."
      />

      {/* Meeting View Modal */}
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
    </Box>
  );
};

export default MeetingScheduler; 