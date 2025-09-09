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
  useColorModeValue,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import { FaEye } from 'react-icons/fa';
import CommonTable from '../../../components/common/Table/CommonTable';
import CommonPagination from '../../../components/common/pagination/CommonPagination';
import TableContainer from '../../../components/common/Table/TableContainer';
import FormModal from '../../../components/common/FormModal';
import FloatingInput from '../../../components/common/FloatingInput';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import Loader from '../../../components/common/Loader';
import CommonAddButton from '../../../components/common/Button/CommonAddButton';
import { 
  fetchAllMeetingScheduleStatuses,
  createMeetingScheduleStatus,
  updateMeetingScheduleStatus,
  deleteMeetingScheduleStatus
} from '../../../services/meetings/meetingScheduleStatusService';
import { showSuccessToast, showErrorToast } from '../../../utils/toastUtils';

const MeetingStatusManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [statuses, setStatuses] = useState([]);
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
  const [statusToDelete, setStatusToDelete] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [statusToView, setStatusToView] = useState(null);

  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  // Fetch statuses on component mount
  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await fetchAllMeetingScheduleStatuses();
      setStatuses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch statuses:', error);
      showErrorToast('Failed to load meeting statuses');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
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

  // Memoize filtered statuses
  const filteredStatuses = useMemo(() => {
    let filtered = statuses;
    if (searchTerm) {
      filtered = filtered.filter(status =>
        status.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        status.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [statuses, searchTerm]);

  // Reset page when filtered results change
  useEffect(() => {
    const maxPage = Math.ceil(filteredStatuses.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredStatuses.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredStatuses.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setSelectedStatus(null);
    setFormData({
      name: '',
      description: '',
      statusCode: '',
      published: true
    });
    setOriginalFormData(null);
    setErrors({});
    onOpen();
  };

  const handleEdit = (status) => {
    setSelectedStatus(status);
    const data = {
      name: status.name || '',
      description: status.description || '',
      statusCode: status.statusCode || '',
      published: status.published !== undefined ? status.published : true
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    onOpen();
  };

  const handleDelete = (status) => {
    setStatusToDelete(status);
    onDeleteOpen();
  };

  const handleView = (status) => {
    setStatusToView(status);
    onViewOpen();
  };

  const confirmDelete = async () => {
    if (statusToDelete && !isApiCallInProgress && !isDeleteLoading) {
      setIsApiCallInProgress(true);
      setIsDeleteLoading(true);
      try {
        await deleteMeetingScheduleStatus(statusToDelete._id);
        showSuccessToast('Status deleted successfully');
        fetchStatuses(); // Refresh the list
        onDeleteClose();
        setStatusToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
        showErrorToast('Failed to delete status');
      } finally {
        setIsApiCallInProgress(false);
        setIsDeleteLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Status name is required';
    }
    if (!formData.statusCode) {
      newErrors.statusCode = 'Status code is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isApiCallInProgress || isSubmitting) {
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      if (selectedStatus) {
        // Update existing status
        await updateMeetingScheduleStatus(selectedStatus._id, formData);
        showSuccessToast('Status updated successfully');
      } else {
        // Add new status
        await createMeetingScheduleStatus(formData);
        showSuccessToast('Status created successfully');
      }
      
      fetchStatuses(); // Refresh the list
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedStatus(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      showErrorToast('Failed to save status');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isFormChanged = () => {
    if (!selectedStatus || !originalFormData) return true;
    return (
      formData.name !== originalFormData.name ||
      formData.description !== originalFormData.description ||
      formData.statusCode !== originalFormData.statusCode ||
      formData.published !== originalFormData.published
    );
  };

  const columns = [
    { 
      key: 'index', 
      label: 'ID',
      render: (value, status) => {
        // Find the index of this status in the filtered data
        const statusIndex = filteredStatuses.findIndex(s => s._id === status._id);
        return (
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {statusIndex + 1}
          </Text>
        );
      },
      width: "50px"
    },
    { 
      key: 'name', 
      label: 'Status Name',
      render: (value) => (
        <HStack spacing={2}>
          <Text fontSize="lg">{getStatusIcon(value)}</Text>
          <Text fontWeight="semibold" color={textColor} noOfLines={1} maxW="120px">{value}</Text>
        </HStack>
      ),
      width: "140px"
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (value) => (
        <Text color={subTextColor} fontSize="sm" noOfLines={1} maxW="200px">
          {value || 'No description'}
        </Text>
      ),
      width: "200px"
    },
    { 
      key: 'statusCode', 
      label: 'Status Code',
      render: (value) => (
        <Badge colorScheme="purple" variant="solid" fontSize="xs">
          {value}
        </Badge>
      ),
      width: "100px"
    },
    {
      key: 'published',
      label: 'Status',
      render: (published) => (
        <Badge colorScheme={published ? 'green' : 'red'} variant="solid" fontSize="xs">
          {published ? 'Active' : 'Inactive'}
        </Badge>
      ),
      width: "80px"
    }
  ];

  const renderRowActions = (status) => (
    <HStack spacing={2}>
      <IconButton
        icon={<FaEye />}
        size="sm"
        variant="ghost"
        colorScheme="blue"
        onClick={() => handleView(status)}
        aria-label="View status"
      />
      <IconButton
        icon={<EditIcon />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleEdit(status)}
        aria-label="Edit status"
      />
      <IconButton
        icon={<DeleteIcon />}
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={() => handleDelete(status)}
        aria-label="Delete status"
      />
    </HStack>
  );

  return (
    <Box p={5}>
      {/* Loader at the top, non-blocking */}
      {loading && <Loader size="xl" />}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Meeting Status Management
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>

      <HStack spacing={4} mb={6}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search statuses..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </InputGroup>
      </HStack>

      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredStatuses.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!loading ? "No statuses found." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredStatuses.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredStatuses.length}
        />
      </TableContainer>

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedStatus(null);
          setFormData({});
          setOriginalFormData(null);
          setErrors({});
        }}
        title={selectedStatus ? 'Edit Status' : 'Add New Status'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedStatus ? 'Update' : 'Save'}
        loadingText={selectedStatus ? 'Updating...' : 'Saving...'}
        isDisabled={selectedStatus ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FloatingInput
              id="name"
              name="name"
              label="Status Name"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={errors.name}
              required={true}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.statusCode}>
            <FloatingInput
              id="statusCode"
              name="statusCode"
              label="Status Code"
              type="number"
              value={formData.statusCode || ''}
              onChange={handleInputChange}
              error={errors.statusCode}
              required={true}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Enter status description..."
              rows={3}
            />
          </FormControl>
        </VStack>
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Status"
        message={`Are you sure you want to delete the status "${statusToDelete?.name}"?`}
        isLoading={isDeleteLoading}
        loadingText="Deleting..."
      />

      {/* Status View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)">
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
                  Status Details
                </Text>
                <Text color="white" opacity="0.9" fontSize="sm">
                  Meeting Status Information
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
                {statusToView && getStatusIcon(statusToView.name)}
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
          <ModalBody p={6}>
            {statusToView && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Status Name
                  </Text>
                  <HStack spacing={2} mt={1}>
                    <Text fontSize="lg">{getStatusIcon(statusToView.name)}</Text>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      {statusToView.name}
                    </Text>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Status Code
                  </Text>
                  <Badge colorScheme="purple" variant="solid" mt={1}>
                    {statusToView.statusCode}
                  </Badge>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Description
                  </Text>
                  <Text color="gray.700" mt={1}>
                    {statusToView.description || 'No description provided'}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Status
                  </Text>
                  <HStack spacing={2} mt={1}>
                    <Badge colorScheme={getStatusColor(statusToView.name)} variant="solid">
                      {statusToView.name}
                    </Badge>
                    <Badge colorScheme={statusToView.published ? 'green' : 'red'} variant="solid">
                      {statusToView.published ? 'Active' : 'Inactive'}
                    </Badge>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Created By
                  </Text>
                  <Text color="gray.700" mt={1}>
                    {statusToView.createdByUserId?.firstName} {statusToView.createdByUserId?.lastName}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Updated By
                  </Text>
                  <Text color="gray.700" mt={1}>
                    {statusToView.updatedByUserId?.firstName} {statusToView.updatedByUserId?.lastName}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MeetingStatusManagement; 