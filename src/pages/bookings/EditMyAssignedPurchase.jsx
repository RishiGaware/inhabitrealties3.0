import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Button, VStack, HStack, Text, Heading, SimpleGrid, Badge,
  Grid, GridItem, useToast, Alert, AlertIcon, AlertTitle,
  AlertDescription, Flex, Spinner, Tooltip,
} from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';
import api from '../../services/api';

const EditMyAssignedPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedInstallments, setEditedInstallments] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (location.state?.bookingData) {
      const bookingData = location.state.bookingData;
      setBooking(bookingData);
      setEditedInstallments(bookingData.installmentSchedule || []);
    } else if (id) {
      fetchBooking();
    }
  }, [id, location.state]);

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/purchase-bookings/assigned/${id}`);
      
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
        navigate('/purchase-bookings/assigned');
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
      navigate('/purchase-bookings/assigned');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

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

  const getInstallmentStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'green';
      case 'PENDING': return 'yellow';
      case 'OVERDUE': return 'red';
      default: return 'gray';
    }
  };



  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Purchase booking updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setHasChanges(false);
      await fetchBooking();
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

  const handleCancel = () => {
    setEditedInstallments(booking?.installmentSchedule || []);
    setHasChanges(false);
    navigate('/purchase-bookings/assigned');
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
          <Heading as="h1" fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }} fontWeight="bold" textAlign="center">
            Edit My Assigned Purchase Booking
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
                        <Badge
                          colorScheme={getInstallmentStatusColor(installment.status)}
                          variant="subtle"
                          size="sm"
                        >
                          {installment.status}
                        </Badge>
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
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Box>
      )}

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

export default EditMyAssignedPurchase;
