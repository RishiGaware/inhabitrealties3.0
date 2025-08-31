import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Badge,
  Grid,
  GridItem,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  Input,
  Textarea,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Spinner,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiSave, FiX, FiEdit, FiCheck, FiClock } from 'react-icons/fi';
import api from '../../services/api';

const EditPurchaseBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  
  // State management
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedInstallments, setEditedInstallments] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

  // Get booking data from navigation state or fetch from API if not available
  useEffect(() => {
    if (location.state?.bookingData) {
      // Use data passed from navigation state
      const bookingData = location.state.bookingData;
      setBooking(bookingData);
      setEditedInstallments(bookingData.installmentSchedule || []);
    } else if (id) {
      // Fallback to API call if no data in state
      fetchBooking();
    }
  }, [id, location.state]);

  // Fallback function to fetch booking data from API if not available in navigation state
  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/purchase-bookings/${id}`);
      
      if (response.data && response.data.data) {
        const bookingData = response.data.data;
        setBooking(bookingData);
        setEditedInstallments(bookingData.installmentSchedule || []);
      } else {
        toast({
          title: "Error",
          description: "Invalid booking data received",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate('/purchase-bookings');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        title: "Error",
        description: "Failed to fetch booking details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate('/purchase-bookings');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
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

  // Get installment status color
  const getInstallmentStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'green';
      case 'PENDING': return 'yellow';
      case 'OVERDUE': return 'red';
      case 'PARTIAL': return 'orange';
      default: return 'gray';
    }
  };

  // Handle installment status change
  const handleInstallmentStatusChange = (installmentId, newStatus) => {
    const updatedInstallments = editedInstallments.map(inst => 
      inst._id === installmentId 
        ? { ...inst, status: newStatus, updatedAt: new Date().toISOString() }
        : inst
    );
    setEditedInstallments(updatedInstallments);
    setHasChanges(true);
  };

  // Handle installment amount change
  const handleInstallmentAmountChange = (installmentId, newAmount) => {
    const updatedInstallments = editedInstallments.map(inst => 
      inst._id === installmentId 
        ? { ...inst, amount: parseFloat(newAmount) || 0, updatedAt: new Date().toISOString() }
        : inst
    );
    setEditedInstallments(updatedInstallments);
    setHasChanges(true);
  };

  // Handle installment due date change
  const handleInstallmentDueDateChange = (installmentId, newDate) => {
    const updatedInstallments = editedInstallments.map(inst => 
      inst._id === installmentId 
        ? { ...inst, dueDate: newDate, updatedAt: new Date().toISOString() }
        : inst
    );
    setEditedInstallments(updatedInstallments);
    setHasChanges(true);
  };

  // Open edit modal for specific installment
  const openEditInstallment = (installment) => {
    setSelectedInstallment(installment);
    onEditModalOpen();
  };

  // Save changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData = {
        ...booking,
        installmentSchedule: editedInstallments,
        updatedAt: new Date().toISOString()
      };

      await api.put(`/purchase-bookings/update/${id}`, updateData);
      
      toast({
        title: "Success",
        description: "Purchase booking updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setHasChanges(false);
      await fetchBooking(); // Refresh data
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update purchase booking",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel changes and redirect
  const handleCancel = () => {
    setEditedInstallments(booking?.installmentSchedule || []);
    setHasChanges(false);
    navigate(-1);
  };



  if (isLoading) {
    return (
      <Box p={{ base: 2, sm: 3, md: 4, lg: 6 }} bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4} px={4}>
          <Spinner size={{ base: "lg", md: "xl" }} color="blue.500" />
          <Text fontSize={{ base: "sm", md: "md" }} textAlign="center">Loading booking details...</Text>
        </VStack>
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box p={{ base: 2, sm: 3, md: 4, lg: 6 }} bg="gray.50" minH="100vh">
        <Alert status="error" mx={{ base: 2, sm: 4 }}>
          <AlertIcon />
          <AlertTitle fontSize={{ base: "sm", md: "md" }}>Error!</AlertTitle>
          <AlertDescription fontSize={{ base: "sm", md: "md" }}>Booking not found.</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={{ base: 2, sm: 3, md: 4, lg: 6 }} bg="gray.50" minH="100vh">
      {/* Header */}
      <VStack spacing={{ base: 3, md: 4, lg: 6 }} align="stretch" mb={{ base: 4, md: 6 }}>
        <Flex justify="center" align="center">
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
        Edit Purchase Booking
        </Heading>
        </Flex>

        {/* Booking ID and Status */}
        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm">
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={{ base: 3, md: 4 }}>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Booking ID</Text>
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
                {booking.bookingId || booking._id?.slice(-8) || 'N/A'}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Status</Text>
              <Badge
                colorScheme={getStatusColor(booking.bookingStatus)}
                variant="solid"
                fontSize={{ base: "xs", md: "sm" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 1, md: 1 }}
              >
                {booking.bookingStatus?.replace(/_/g, ' ') || 'N/A'}
              </Badge>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Created Date</Text>
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
                {formatDate(booking.createdAt)}
              </Text>
            </GridItem>
          </Grid>
        </Box>
      </VStack>

      {/* Property & Customer Details */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }} mb={{ base: 4, md: 6 }}>
        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm">
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Property Details</Text>
          <VStack spacing={{ base: 2, md: 3 }} align="start">
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Name:</strong> {booking.propertyId?.name || 'N/A'}</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Price:</strong> {formatCurrency(booking.propertyId?.price)}</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Description:</strong> {booking.propertyId?.description || 'No description'}</Text>
            {booking.propertyId?.propertyAddress && (
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Address:</strong> {`${booking.propertyId.propertyAddress.street}, ${booking.propertyId.propertyAddress.city}, ${booking.propertyId.propertyAddress.state}`}</Text>
            )}
          </VStack>
        </Box>

        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm">
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Customer Details</Text>
          <VStack spacing={{ base: 2, md: 3 }} align="start">
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Name:</strong> {booking.customerId ? `${booking.customerId.firstName || ''} ${booking.customerId.lastName || ''}`.trim() : 'N/A'}</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Email:</strong> {booking.customerId?.email || 'N/A'}</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Phone:</strong> {booking.customerId?.phoneNumber || 'N/A'}</Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Financial Details */}
      {(booking.totalPropertyValue || booking.downPayment || booking.loanAmount) && (
        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm" mb={{ base: 4, md: 6 }}>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Financial Details</Text>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={{ base: 3, md: 4 }}>
            {booking.totalPropertyValue && (
              <GridItem>
                <Text fontSize="sm" color="gray.600" fontWeight="semibold">Total Property Value</Text>
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
                  {formatCurrency(booking.totalPropertyValue)}
                </Text>
              </GridItem>
            )}
            {booking.downPayment && (
              <GridItem>
                <Text fontSize="sm" color="gray.600" fontWeight="semibold">Down Payment</Text>
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
                  {formatCurrency(booking.downPayment)}
                </Text>
              </GridItem>
            )}
            {booking.loanAmount && (
              <GridItem>
                <Text fontSize="sm" color="gray.600" fontWeight="semibold">Loan Amount</Text>
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
                  {formatCurrency(booking.loanAmount)}
                </Text>
              </GridItem>
            )}
          </Grid>
        </Box>
      )}

      {/* Payment Terms */}
      <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm" mb={{ base: 4, md: 6 }}>
        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Payment Terms</Text>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, md: 4 }}>
          <GridItem>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">Payment Terms</Text>
            <Badge colorScheme="blue" variant="solid" fontSize={{ base: "xs", md: "sm" }} px={{ base: 2, md: 3 }} py={{ base: 1, md: 1 }}>
              {booking.paymentTerms || 'N/A'}
            </Badge>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">Number of Installments</Text>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
              {booking.installmentCount || '0'}
            </Text>
          </GridItem>
        </Grid>
      </Box>

      {/* Financing Details */}
      {booking.isFinanced && (
        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm" mb={{ base: 4, md: 6 }}>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Financing Details</Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, md: 4 }}>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Bank Name</Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.800">{booking.bankName || 'N/A'}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Loan Tenure</Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.800">{booking.loanTenure ? `${booking.loanTenure} months` : 'N/A'}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Interest Rate</Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.800">{booking.interestRate ? `${booking.interestRate}%` : 'N/A'}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">EMI Amount</Text>
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
                {formatCurrency(booking.emiAmount)}
              </Text>
            </GridItem>
          </Grid>
        </Box>
      )}

      {/* Installment Schedule - Editable */}
      {booking.installmentSchedule && booking.installmentSchedule.length > 0 && (
        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm" mb={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 3, md: 4 }} align="stretch">
            <HStack justify="space-between" align="center" direction={{ base: "column", sm: "row" }} spacing={{ base: 2, sm: 4 }}>
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" textAlign={{ base: "center", sm: "left" }}>
                Installment Schedule ({editedInstallments.length} installments)
              </Text>
              <HStack spacing={2} flexWrap="wrap" justify={{ base: "center", sm: "flex-end" }}>
                <Badge colorScheme="green" variant="subtle" fontSize={{ base: "xs", md: "sm" }}>
                  {editedInstallments.filter(inst => inst.status === 'PAID').length} Paid
                </Badge>
                <Badge colorScheme="yellow" variant="subtle" fontSize={{ base: "xs", md: "sm" }}>
                  {editedInstallments.filter(inst => inst.status === 'PENDING').length} Pending
                </Badge>
                <Badge colorScheme="red" variant="subtle" fontSize={{ base: "xs", md: "sm" }}>
                  {editedInstallments.filter(inst => inst.status === 'OVERDUE').length} Overdue
                </Badge>
              </HStack>
            </HStack>
            
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" textAlign="center">
              Amount per installment: {formatCurrency(editedInstallments[0]?.amount)}
            </Text>
            
            <Box 
              maxH={{ base: "300px", sm: "400px", md: "500px" }} 
              overflowY="auto" 
              border="1px" 
              borderColor="gray.200" 
              borderRadius="md"
              bg="gray.50"
            >
              <SimpleGrid 
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
                spacing={{ base: 2, sm: 3 }} 
                p={{ base: 2, sm: 3 }}
              >
                {editedInstallments.map((installment, index) => (
                  <Box 
                    key={installment._id || index} 
                    p={{ base: 2, sm: 3 }} 
                    bg={installment.status === 'PAID' ? 'green.50' : 'white'} 
                    borderRadius="md" 
                    border="1px" 
                    borderColor={
                      installment.status === 'PAID' ? 'green.200' :
                      installment.status === 'PENDING' ? 'yellow.200' :
                      installment.status === 'OVERDUE' ? 'red.200' : 'gray.200'
                    }
                    _hover={{ 
                      transform: 'translateY(-2px)', 
                      boxShadow: 'md',
                      transition: 'all 0.2s'
                    }}
                  >
                    <VStack spacing={2} align="start">
                      <HStack justify="space-between" w="full">
                        <Text fontSize="xs" color="gray.500" fontWeight="medium">
                          Installment {installment.installmentNumber}
                        </Text>
                        <HStack spacing={1}>
                          <Badge
                            colorScheme={getInstallmentStatusColor(installment.status)}
                            variant="subtle"
                            size="sm"
                          >
                            {installment.status}
                          </Badge>
                          <Tooltip label="Edit Installment">
                            <IconButton
                              icon={<FiEdit />}
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => openEditInstallment(installment)}
                            />
                          </Tooltip>
                        </HStack>
                      </HStack>
                      
                      <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        {formatCurrency(installment.amount)}
                      </Text>
                      
                      <VStack spacing={1} align="start" w="full">
                        <Text fontSize="xs" color="gray.600">
                          <strong>Due:</strong> {formatDate(installment.dueDate)}
                        </Text>
                        
                        {installment.status === 'PAID' && installment.paidDate && (
                          <Text fontSize="xs" color="green.600">
                            <strong>Paid:</strong> {formatDate(installment.paidDate)}
                          </Text>
                        )}
                        
                        {installment.lateFees > 0 && (
                          <Text fontSize="xs" color="red.600">
                            <strong>Late Fees:</strong> {formatCurrency(installment.lateFees)}
                          </Text>
                        )}
                        
                        {installment.paymentId && (
                          <Text fontSize="xs" color="blue.600">
                            <strong>Payment ID:</strong> {installment.paymentId.slice(-8)}
                          </Text>
                        )}
                      </VStack>
                      
                      {installment.responsiblePersonId && (
                        <Text fontSize="xs" color="gray.500">
                          <strong>Responsible:</strong> {installment.responsiblePersonId.firstName || 'N/A'}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Box>
      )}

      {/* Edit Installment Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size={{ base: "full", sm: "md", lg: "lg" }} isCentered>
        <ModalOverlay />
        <ModalContent 
          maxW={{ base: "95vw", sm: "70vw", md: "70vw", lg: "70vw", xl: "70vw" }}
          maxH={{ base: "95vh", md: "auto" }}
          h={{ base: "95vh", md: "auto" }}
          overflow="hidden"
          mx={{ base: 1, md: 4 }}
          my={{ base: 1, md: 4 }}
          display="flex"
          flexDirection="column"
          borderRadius={{ base: "0", sm: "lg" }}
        >
          <ModalHeader 
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="semibold"
            color="gray.800"
            position="relative"
            pr="12"
          >
            Edit Installment {selectedInstallment?.installmentNumber}
            <IconButton
              aria-label="Close modal"
              icon={<FiX />}
              size="sm"
              variant="ghost"
              position="absolute"
              right="4"
              top="50%"
              transform="translateY(-50%)"
              onClick={onEditModalClose}
              _hover={{ bg: "gray.100" }}
            />
          </ModalHeader>
          <ModalBody 
            flex="1"
            overflowY="auto"
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
            minH={0}
            maxH="none"
            bg="white"
          >
            {selectedInstallment && (
              <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700">
                    Status
                  </FormLabel>
                  <Select
                    value={selectedInstallment.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelectedInstallment({ ...selectedInstallment, status: newStatus });
                      handleInstallmentStatusChange(selectedInstallment._id, newStatus);
                    }}
                    size={{ base: "md", md: "lg" }}
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700">
                    Amount
                  </FormLabel>
                  <Input
                    type="number"
                    value={selectedInstallment.amount}
                    onChange={(e) => {
                      const newAmount = e.target.value;
                      setSelectedInstallment({ ...selectedInstallment, amount: newAmount });
                      handleInstallmentAmountChange(selectedInstallment._id, newAmount);
                    }}
                    placeholder="Enter amount"
                    size={{ base: "md", md: "lg" }}
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    bg="white"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700">
                    Due Date
                  </FormLabel>
                  <Input
                    type="date"
                    value={selectedInstallment.dueDate ? new Date(selectedInstallment.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setSelectedInstallment({ ...selectedInstallment, dueDate: newDate });
                      handleInstallmentDueDateChange(selectedInstallment._id, newDate);
                    }}
                    size={{ base: "md", md: "lg" }}
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    bg="white"
                  />
                </FormControl>

                {selectedInstallment.status === 'PAID' && (
                  <FormControl>
                    <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="green.700">
                      Paid Date
                    </FormLabel>
                    <Input
                      type="date"
                      value={selectedInstallment.paidDate ? new Date(selectedInstallment.paidDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const newPaidDate = e.target.value;
                        setSelectedInstallment({ ...selectedInstallment, paidDate: newPaidDate });
                        const updatedInstallments = editedInstallments.map(inst => 
                          inst._id === selectedInstallment._id 
                            ? { ...inst, paidDate: newPaidDate, updatedAt: new Date().toISOString() }
                            : inst
                        );
                        setEditedInstallments(updatedInstallments);
                        setHasChanges(true);
                      }}
                      size={{ base: "md", md: "lg" }}
                      borderRadius="md"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                      bg="white"
                    />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700">
                    Late Fees
                  </FormLabel>
                  <Input
                    type="number"
                    value={selectedInstallment.lateFees || 0}
                    onChange={(e) => {
                      const newLateFees = parseFloat(e.target.value) || 0;
                      setSelectedInstallment({ ...selectedInstallment, lateFees: newLateFees });
                      const updatedInstallments = editedInstallments.map(inst => 
                        inst._id === selectedInstallment._id 
                          ? { ...inst, lateFees: newLateFees, updatedAt: new Date().toISOString() }
                          : inst
                      );
                      setEditedInstallments(updatedInstallments);
                      setHasChanges(true);
                    }}
                    placeholder="Enter late fees"
                    size={{ base: "md", md: "lg" }}
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    bg="white"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter 
            flexShrink={0}
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            px={{ base: 4, md: 6 }}
            py={{ base: 3, md: 4 }}
          >
            <Button 
              variant="ghost" 
              onClick={onEditModalClose} 
              size={{ base: 'md', md: 'lg' }}
              px={{ base: 6, md: 8 }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Action Buttons - Bottom Right */}
      <Box mt={{ base: 6, md: 8 }} textAlign="right">
        <HStack spacing={{ base: 3, md: 4 }} justify={{ base: "center", md: "flex-end" }} flexWrap="wrap">
          <Button
            onClick={handleCancel}
            variant="ghost"
            size={{ base: "sm", md: "md" }}
            px={{ base: 4, md: 6 }}
          >
            Cancel
          </Button>
          <Button
            leftIcon={<FiSave />}
            onClick={handleSave}
            colorScheme="brand"
            isLoading={isSaving}
            loadingText="Saving..."
            size={{ base: "sm", md: "md" }}
            px={{ base: 4, md: 6 }}
            isDisabled={!hasChanges}
          >
            Update
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default EditPurchaseBooking;
