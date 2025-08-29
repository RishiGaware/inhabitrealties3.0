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

const EditRentalBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  // State management
  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedRental, setEditedRental] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

  // Get rental data from navigation state or fetch from API if not available
  useEffect(() => {
    if (location.state?.bookingData) {
      // Use data passed from navigation state
      const rentalData = location.state.bookingData;
      setRental(rentalData);
      setEditedRental(rentalData);
    } else if (id) {
      // Fallback to API call if no data in state
      fetchRental();
    }
  }, [id, location.state]);

  // Fallback function to fetch rental data from API if not available in navigation state
  const fetchRental = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/rental-bookings/${id}`);
      
      if (response.data && response.data.data) {
        const rentalData = response.data.data;
        setRental(rentalData);
        setEditedRental(rentalData);
      } else {
        toast({
          title: "Error",
          description: "Invalid rental data received",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate('/rental-bookings');
      }
    } catch (error) {
      console.error('Error fetching rental:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rental details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate('/rental-bookings');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
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
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'yellow';
      case 'EXPIRED': return 'red';
      case 'CANCELLED': return 'gray';
      default: return 'gray';
    }
  };

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setEditedRental(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Open edit modal for a specific field
  const openEditField = (field, value) => {
    setSelectedField({ field, value });
    onEditModalOpen();
  };

  // Save changes
  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      // Mock success for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Rental booking updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setHasChanges(false);
      setRental(editedRental);
    } catch (error) {
      console.error('Error updating rental:', error);
      toast({
        title: "Error",
        description: "Failed to update rental booking",
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
    setEditedRental(rental);
    setHasChanges(false);
    navigate('/rental-bookings/all');
  };

  if (isLoading) {
    return (
      <Box p={{ base: 2, sm: 3, md: 4, lg: 6 }} bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4} px={4}>
          <Spinner size={{ base: "lg", md: "xl" }} color="blue.500" />
          <Text fontSize={{ base: "sm", md: "md" }} textAlign="center">Loading rental details...</Text>
        </VStack>
      </Box>
    );
  }

  if (!rental) {
    return (
      <Box p={{ base: 2, sm: 3, md: 4, lg: 6 }} bg="gray.50" minH="100vh">
        <Alert status="error" mx={{ base: 2, sm: 4 }}>
          <AlertIcon />
          <AlertTitle fontSize={{ base: "sm", md: "md" }}>Error!</AlertTitle>
          <AlertDescription fontSize={{ base: "sm", md: "md" }}>Rental not found.</AlertDescription>
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
            Edit Rental Booking
          </Heading>
        </Flex>

        {/* Rental ID and Status */}
        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm">
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={{ base: 3, md: 4 }}>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Rental ID</Text>
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
                {rental.rentalId || rental._id?.slice(-8) || 'N/A'}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Status</Text>
              <Badge
                colorScheme={getStatusColor(rental.rentalStatus)}
                variant="solid"
                fontSize={{ base: "xs", md: "sm" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 1, md: 1 }}
              >
                {rental.rentalStatus?.replace(/_/g, ' ') || 'N/A'}
              </Badge>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">Created Date</Text>
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800">
                {formatDate(rental.createdAt)}
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
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Name:</strong> {rental.propertyId?.name || 'N/A'}</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Type:</strong> {rental.propertyId?.type || 'N/A'}</Text>
            {rental.propertyId?.propertyAddress && (
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Address:</strong> {`${rental.propertyId.propertyAddress.street}, ${rental.propertyId.propertyAddress.city}, ${rental.propertyId.propertyAddress.state}`}</Text>
            )}
          </VStack>
        </Box>

        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm">
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Customer Details</Text>
          <VStack spacing={{ base: 2, md: 3 }} align="start">
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Name:</strong> {rental.customerId ? `${rental.customerId.firstName || ''} ${rental.customerId.lastName || ''}`.trim() : 'N/A'}</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Email:</strong> {rental.customerId?.email || 'N/A'}</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800"><strong>Phone:</strong> {rental.customerId?.phoneNumber || 'N/A'}</Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Rental Details */}
      <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm" mb={{ base: 4, md: 6 }}>
        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Rental Details</Text>
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={{ base: 3, md: 4 }}>
          <GridItem>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">Monthly Rent</Text>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
              {formatCurrency(rental.monthlyRent)}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">Security Deposit</Text>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
              {formatCurrency(rental.securityDeposit)}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">Lease Duration</Text>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800">
              {rental.leaseDuration ? `${rental.leaseDuration} months` : 'N/A'}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">Lease Start</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800">
              {formatDate(rental.leaseStart)}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">Lease End</Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.800">
              {formatDate(rental.leaseEnd)}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">Lease Terms</Text>
            <Badge colorScheme="blue" variant="solid" fontSize={{ base: "xs", md: "sm" }} px={{ base: 2, md: 3 }} py={{ base: 1, md: 1 }}>
              {rental.leaseTerms?.replace(/_/g, ' ') || 'N/A'}
            </Badge>
          </GridItem>
        </Grid>
      </Box>

      {/* Property Features */}
      {(rental.utilitiesIncluded || rental.parkingIncluded || rental.petFriendly) && (
        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm" mb={{ base: 4, md: 6 }}>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Property Features</Text>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 2, md: 3 }}>
            {rental.utilitiesIncluded && (
              <HStack justify="space-between" p={3} bg="green.50" borderRadius="md" border="1px" borderColor="green.200">
                <Text fontSize={{ base: "sm", md: "md" }}>Utilities</Text>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium" color="green.600">Included</Text>
              </HStack>
            )}
            {rental.parkingIncluded && (
              <HStack justify="space-between" p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                <Text fontSize={{ base: "sm", md: "md" }}>Parking</Text>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium" color="blue.600">Included</Text>
              </HStack>
            )}
            {rental.petFriendly && (
              <HStack justify="space-between" p={3} bg="orange.50" borderRadius="md" border="1px" borderColor="orange.200">
                <Text fontSize={{ base: "sm", md: "md" }}>Pet Policy</Text>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium" color="orange.600">Pet Friendly</Text>
              </HStack>
            )}
          </SimpleGrid>
        </Box>
      )}

      {/* Notes */}
      {rental.notes && (
        <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="md" border="1px" borderColor="gray.200" shadow="sm" mb={{ base: 4, md: 6 }}>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={3}>Additional Notes</Text>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.800" p={3} bg="gray.50" borderRadius="md">
            {rental.notes}
          </Text>
        </Box>
      )}

      {/* Edit Field Modal */}
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
            Edit {selectedField?.field?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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
            {selectedField && (
              <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700">
                    New Value
                  </FormLabel>
                  <Input
                    value={selectedField.value}
                    onChange={(e) => setSelectedField({ ...selectedField, value: e.target.value })}
                    placeholder={`Enter new ${selectedField.field}`}
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

export default EditRentalBooking;
