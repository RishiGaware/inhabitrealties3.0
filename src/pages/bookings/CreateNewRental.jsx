import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Card,
  CardBody,
  CardHeader,
  Heading,
  useToast,
  SimpleGrid,
  Grid,
  GridItem,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { FiSave, FiX, FiHome, FiUser, FiCalendar, FiCheckCircle, FiInfo } from 'react-icons/fi';
import SearchableSelect from '../../components/common/SearchableSelect';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const CreateNewRental = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState({
    propertyId: "",
    customerId: "",
    monthlyRent: "",
    securityDeposit: "",
    leaseStart: "",
    leaseEnd: "",
    leaseDuration: "",
    leaseTerms: "LONG_TERM",
    utilitiesIncluded: false,
    parkingIncluded: false,
    petFriendly: false,
    notes: "",
    rentalStatus: "PENDING",
  });

  // Data for dropdowns
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Selected property details
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Success modal state
  const [createdRental, setCreatedRental] = useState(null);

  // Loading states
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsDataLoading(true);
    try {
      // Fetch properties
      let propertiesData;
      try {
        propertiesData = await api.get('/properties/all');
      } catch (error) {
        console.warn("Failed to fetch properties, using mock data:", error);
        propertiesData = { data: [] };
      }

      // Fetch customers (users with USER role)
      let customersData = { data: [] };
      try {
        customersData = await api.get('/users/all');
      } catch (error) {
        console.warn("Failed to fetch customers, using mock data:", error);
      }

      // Use real data if available, otherwise fall back to mock data
      let publishedProperties =
        propertiesData.data?.filter((prop) => prop.published) || [];
      let publishedCustomers = customersData.data || [];

      // If no real data, use mock data
      if (publishedProperties.length === 0) {
        publishedProperties = [
          {
            _id: "prop_1",
            name: "Modern Studio Apartment",
            address: "123 Main St, Downtown",
            price: 25000,
            type: "APARTMENT",
            published: true,
          },
          {
            _id: "prop_2",
            name: "Downtown Loft",
            address: "456 Oak Ave, Downtown",
            price: 35000,
            type: "LOFT",
            published: true,
          },
          {
            _id: "prop_3",
            name: "Suburban House",
            address: "789 Pine St, Suburbs",
            price: 45000,
            type: "HOUSE",
            published: true,
          },
        ];
      }

      if (publishedCustomers.length === 0) {
        publishedCustomers = [
          {
            _id: "cust_1",
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            phone: "+1234567890",
            published: true,
          },
          {
            _id: "cust_2",
            firstName: "Bob",
            lastName: "Smith",
            email: "bob@example.com",
            phone: "+1234567891",
            published: true,
          },
          {
            _id: "cust_3",
            firstName: "Carol",
            lastName: "Brown",
            email: "carol@example.com",
            phone: "+1234567892",
            published: true,
          },
        ];
      }

      setProperties(publishedProperties);
      setCustomers(publishedCustomers);

    } catch (error) {
      console.error("Error in fetchInitialData:", error);
      // Set mock data as fallback
      setProperties([
        {
          _id: "prop_1",
          name: "Modern Studio Apartment",
          address: "123 Main St, Downtown",
          price: 25000,
          type: "APARTMENT",
          published: true,
        },
        {
          _id: "prop_2",
          name: "Downtown Loft",
          address: "456 Oak Ave, Downtown",
          price: 35000,
          type: "LOFT",
          published: true,
        },
        {
          _id: "prop_3",
          name: "Suburban House",
          address: "789 Pine St, Suburbs",
          price: 45000,
          type: "HOUSE",
          published: true,
        },
      ]);
      setCustomers([
        {
          _id: "cust_1",
          firstName: "Alice",
          lastName: "Johnson",
          email: "alice@example.com",
          phone: "+1234567890",
          published: true,
        },
        {
          _id: "cust_2",
          firstName: "Bob",
          lastName: "Smith",
          email: "bob@example.com",
          phone: "+1234567891",
          published: true,
        },
        {
          _id: "cust_3",
          firstName: "Carol",
          lastName: "Brown",
          email: "carol@example.com",
          phone: "+1234567892",
          published: true,
        },
      ]);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePropertyChange = (propertyId) => {
    const property = properties.find((p) => p._id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setFormData((prev) => ({
        ...prev,
        propertyId,
        monthlyRent: property.price,
      }));
    } else {
      setSelectedProperty(null);
      setFormData((prev) => ({
        ...prev,
        propertyId: "",
        monthlyRent: "",
      }));
    }
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerId,
      }));
    }
  };

  const calculateLeaseDuration = () => {
    if (formData.leaseStart && formData.leaseEnd) {
      const start = new Date(formData.leaseStart);
      const end = new Date(formData.leaseEnd);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      return months;
    }
    return 0;
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.propertyId) errors.push("Property selection is required");
    if (!formData.customerId) errors.push("Customer selection is required");
    if (!formData.monthlyRent || formData.monthlyRent <= 0)
      errors.push("Valid monthly rent is required");
    if (!formData.securityDeposit || formData.securityDeposit <= 0)
      errors.push("Valid security deposit is required");
    if (!formData.leaseStart) errors.push("Lease start date is required");
    if (!formData.leaseEnd) errors.push("Lease end date is required");

    if (formData.leaseStart && formData.leaseEnd) {
      const start = new Date(formData.leaseStart);
      const end = new Date(formData.leaseEnd);
      if (end <= start) {
        errors.push("Lease end date must be after start date");
      }
    }

    return errors;
  };

  // Prevent form submission if required fields are empty
  const isFormValid = () => {
    return formData.propertyId && 
           formData.customerId && 
           formData.monthlyRent && 
           formData.securityDeposit &&
           formData.leaseStart &&
           formData.leaseEnd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if SearchableSelect components have values
    if (!formData.propertyId || !formData.customerId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate lease duration
      const duration = calculateLeaseDuration();

      // Prepare the API payload (commented out for now until real API is implemented)
      // const payload = {
      //   propertyId: formData.propertyId,
      //   customerId: formData.customerId,
      //   monthlyRent: parseFloat(formData.monthlyRent),
      //   securityDeposit: parseFloat(formData.securityDeposit),
      //   leaseStart: formData.leaseStart,
      //   leaseEnd: formData.leaseEnd,
      //   leaseDuration: duration,
      //   leaseTerms: formData.leaseTerms,
      //   utilitiesIncluded: formData.utilitiesIncluded,
      //   parkingIncluded: formData.parkingIncluded,
      //   petFriendly: formData.petFriendly,
      //   notes: formData.notes,
      //   rentalStatus: formData.rentalStatus,
      // };

      // Mock success response for now
      const mockResponse = {
        data: {
          rentalId: `RENTAL-${new Date().getFullYear()}-${Date.now()}`,
          propertyId: formData.propertyId,
          customerId: formData.customerId,
          monthlyRent: formData.monthlyRent,
          securityDeposit: formData.securityDeposit,
          leaseStart: formData.leaseStart,
          leaseEnd: formData.leaseEnd,
          leaseDuration: duration,
          leaseTerms: formData.leaseTerms,
          utilitiesIncluded: formData.utilitiesIncluded,
          parkingIncluded: formData.parkingIncluded,
          petFriendly: formData.petFriendly,
          notes: formData.notes,
          rentalStatus: formData.rentalStatus,
          createdAt: new Date().toISOString(),
        }
      };

      // Show success modal
      setCreatedRental(mockResponse.data);
      onOpen();

      toast.success("Rental booking created successfully!");
    } catch (error) {
      console.error("Error creating rental booking:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create rental booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: "",
      customerId: "",
      monthlyRent: "",
      securityDeposit: "",
      leaseStart: "",
      leaseEnd: "",
      leaseDuration: "",
      leaseTerms: "LONG_TERM",
      utilitiesIncluded: false,
      parkingIncluded: false,
      petFriendly: false,
      notes: "",
      rentalStatus: "PENDING",
    });
    setSelectedProperty(null);
  };

  const handleSuccessModalClose = () => {
    onClose();
    setCreatedRental(null);
    resetForm();
    navigate("/rental-bookings/all");
  };

  const handleModalClose = () => {
    onClose();
    setCreatedRental(null);
    resetForm();
  };

  if (isDataLoading) {
    return (
      <Box
        p={6}
        bg="gray.50"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Loader
          size="xl"
          label="Loading properties and customers..."
        />
      </Box>
    );
  }

  // Theme colors
  const cardBg = "white";
  const cardBorder = "gray.200";

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 0 }}>
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
            Create New Rental Booking
        </Heading>
      </Flex>

      <form id="rental-booking-form" onSubmit={handleSubmit} noValidate>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Property Selection */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
                <HStack>
                <FiHome color="blue.500" size={20} />
                <Heading size="md" color="blue.700">
                  Property Selection
                </Heading>
                </HStack>
              </CardHeader>
            <CardBody pt={0}>
                  <FormControl isRequired>
                <FormLabel fontWeight="semibold">Select Property</FormLabel>
                <SearchableSelect
                  name="propertyId"
                  placeholder="Search and choose a property"
                      value={formData.propertyId}
                  onChange={handlePropertyChange}
                  options={properties.map(property => ({
                    value: property._id,
                    label: `${property.name || property.title} - ₹${property.price?.toLocaleString() || 'N/A'}`
                  }))}
                  isDisabled={isSubmitting}
                  isRequired={true}
                />
                <FormHelperText>
                  Search and select from available properties
                </FormHelperText>
                {!formData.propertyId && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    Property selection is required
                  </Text>
                )}
                  </FormControl>

              {/* Property Details Display */}
              {selectedProperty && (
                <Box mt={4} p={{ base: 3, md: 4 }} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <FiInfo color="blue.600" />
                      <Text fontWeight="semibold" color="blue.800" fontSize={{ base: 'sm', md: 'md' }}>Selected Property Details</Text>
                    </HStack>
                    
                    <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={{ base: 3, md: 4 }}>
                      <GridItem>
                        <VStack spacing={2} align="stretch">
                          <HStack>
                            <FiHome color="blue.600" size={16} />
                            <Text fontWeight="medium">Name</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">{selectedProperty.name}</Text>
                </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack spacing={2} align="stretch">
                <HStack>
                            <FiCalendar color="blue.600" size={16} />
                            <Text fontWeight="medium">Type</Text>
                </HStack>
                          <Text fontSize="sm" color="gray.700">{selectedProperty.type}</Text>
                        </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack spacing={2} align="stretch">
                          <HStack>
                            <FiHome color="blue.600" size={16} />
                            <Text fontWeight="medium">Address</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">{selectedProperty.address}</Text>
                        </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack spacing={2} align="stretch">
                          <HStack>
                            <FiCalendar color="blue.600" size={16} />
                            <Text fontWeight="medium">Monthly Rent</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                            ₹{selectedProperty.price?.toLocaleString()}
                          </Text>
                        </VStack>
                      </GridItem>
                    </Grid>
                </VStack>
                </Box>
              )}
              </CardBody>
            </Card>

          {/* Customer Selection */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
                <HStack>
                <FiUser color="green.500" size={20} />
                <Heading size="md" color="green.700">
                  Customer Selection
                </Heading>
                </HStack>
              </CardHeader>
            <CardBody pt={0}>
                <FormControl isRequired>
                <FormLabel fontWeight="semibold">Select Customer</FormLabel>
                <SearchableSelect
                  name="customerId"
                  placeholder="Search and choose a customer"
                  value={formData.customerId}
                  onChange={handleCustomerChange}
                  options={customers.map(customer => ({
                    value: customer._id,
                    label: `${customer.firstName || ""} ${
                      customer.lastName || ""
                    }`.trim()
                      ? `${customer.firstName} ${customer.lastName} - ${customer.email}`
                      : `Unknown Customer - ${customer.email}`
                  }))}
                  isDisabled={isSubmitting}
                  isRequired={true}
                />
                <FormHelperText>
                  Search and select from registered customers
                </FormHelperText>
                {!formData.customerId && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    Customer selection is required
                  </Text>
                )}
                </FormControl>
              </CardBody>
            </Card>

          {/* Rental Details */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
                <HStack>
                <FiCalendar color="orange.500" size={20} />
                <Heading size="md" color="orange.700">
                  Rental Details
                </Heading>
                </HStack>
              </CardHeader>
            <CardBody pt={0}>
                <VStack spacing={4}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }} w="full">
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">
                      Monthly Rent
                    </FormLabel>
                    <NumberInput
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={(value) =>
                        handleInputChange("monthlyRent", value)
                      }
                      min={0}
                      isDisabled={isSubmitting}
                      size="md"
                    >
                      <NumberInputField placeholder="Enter monthly rent amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>This value is automatically set from the selected property (in ₹)</FormHelperText>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Security Deposit</FormLabel>
                    <NumberInput
                      name="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={(value) =>
                        handleInputChange("securityDeposit", value)
                      }
                      min={0}
                      isDisabled={isSubmitting}
                      size="md"
                    >
                      <NumberInputField placeholder="Enter security deposit amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }} w="full">
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Lease Start Date</FormLabel>
                    <Input
                      name="leaseStart"
                      type="date"
                      value={formData.leaseStart}
                      onChange={(e) =>
                        handleInputChange("leaseStart", e.target.value)
                      }
                      isDisabled={isSubmitting}
                      size="md"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Lease End Date</FormLabel>
                    <Input
                      name="leaseEnd"
                      type="date"
                      value={formData.leaseEnd}
                      onChange={(e) =>
                        handleInputChange("leaseEnd", e.target.value)
                      }
                      isDisabled={isSubmitting}
                      size="md"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }} w="full">
                  <FormControl>
                    <FormLabel fontWeight="semibold">Lease Terms</FormLabel>
                    <Select
                      name="leaseTerms"
                      value={formData.leaseTerms}
                      onChange={(e) =>
                        handleInputChange("leaseTerms", e.target.value)
                      }
                      isDisabled={isSubmitting}
                      size="md"
                    >
                      <option value="SHORT_TERM">Short Term</option>
                      <option value="LONG_TERM">Long Term</option>
                      <option value="MONTH_TO_MONTH">Month to Month</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold">Lease Duration</FormLabel>
                    <Input
                      name="leaseDuration"
                      value={calculateLeaseDuration() > 0 ? `${calculateLeaseDuration()} months` : ''}
                      isReadOnly
                      bg="gray.100"
                      size="md"
                    />
                    <FormHelperText>Automatically calculated from start and end dates</FormHelperText>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 3, md: 4 }} w="full">
                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Text fontWeight="semibold">Utilities Included</Text>
                        <Switch
                          name="utilitiesIncluded"
                          isChecked={formData.utilitiesIncluded}
                          onChange={(e) =>
                            handleInputChange("utilitiesIncluded", e.target.checked)
                          }
                          colorScheme="blue"
                          isDisabled={isSubmitting}
                        />
                      </HStack>
                    </FormLabel>
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Text fontWeight="semibold">Parking Included</Text>
                        <Switch
                          name="parkingIncluded"
                          isChecked={formData.parkingIncluded}
                          onChange={(e) =>
                            handleInputChange("parkingIncluded", e.target.checked)
                          }
                          colorScheme="blue"
                          isDisabled={isSubmitting}
                        />
                      </HStack>
                    </FormLabel>
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Text fontWeight="semibold">Pet Friendly</Text>
                        <Switch
                          name="petFriendly"
                          isChecked={formData.petFriendly}
                          onChange={(e) =>
                            handleInputChange("petFriendly", e.target.checked)
                          }
                          colorScheme="blue"
                          isDisabled={isSubmitting}
                        />
                      </HStack>
                    </FormLabel>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontWeight="semibold">Additional Notes</FormLabel>
                  <Input
                    name="notes"
                    placeholder="Any additional notes or special requirements"
                    value={formData.notes}
                    onChange={(e) =>
                      handleInputChange("notes", e.target.value)
                    }
                    isDisabled={isSubmitting}
                    size="md"
                  />
                </FormControl>
              </VStack>
              </CardBody>
            </Card>

          {/* Submit Button */}
          <Box textAlign="center" pt={4}>
            <HStack spacing={4} justify="center">
              <Button
                onClick={() => navigate('/rental-bookings/all')}
                variant="ghost"
                size="md"
              >
                Cancel
              </Button>
              <Button
                leftIcon={<FiSave />}
                type="submit"
                colorScheme="brand"
                isLoading={isSubmitting}
                loadingText="Creating..."
                size="md"
                isDisabled={!isFormValid()}
              >
                Create Rental Booking
              </Button>
            </HStack>
          </Box>
          </VStack>
      </form>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size={{ base: "full", sm: "4xl" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent mx={{ base: 2, sm: 0 }} maxH={{ base: "100vh", sm: "90vh" }} overflow="hidden">
          <ModalHeader bg="green.500" color="white" borderRadius="lg">
            <HStack>
              <FiCheckCircle />
              <Text>Rental Booking Created Successfully! 🎉</Text>
            </HStack>
          </ModalHeader>
          <ModalBody p={{ base: 4, md: 6 }}>
            {createdRental && (
              <VStack spacing={6} align="stretch">
                <Card bg="green.50" border="1px" borderColor="green.200">
        <CardBody>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <HStack justify="space-between" p={3} bg="blue.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Rental ID:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {createdRental.rentalId}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="purple.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Status:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {createdRental.rentalStatus}
                          </Text>
                        </HStack>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <HStack justify="space-between" p={3} bg="blue.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Monthly Rent:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="blue.600">
                            ₹{createdRental.monthlyRent?.toLocaleString()}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="green.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Security Deposit:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="green.600">
                            ₹{createdRental.securityDeposit?.toLocaleString()}
                          </Text>
                        </HStack>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <HStack justify="space-between" p={3} bg="orange.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Lease Start:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {new Date(createdRental.leaseStart).toLocaleDateString()}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="red.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Lease End:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {new Date(createdRental.leaseEnd).toLocaleDateString()}
                          </Text>
                        </HStack>
                      </SimpleGrid>

                      <HStack justify="space-between" p={3} bg="teal.50" borderRadius="md">
                        <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Lease Duration:</Text>
                        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="teal.600">
                          {createdRental.leaseDuration} months
                        </Text>
                      </HStack>

                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <HStack justify="space-between" p={3} bg="purple.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Lease Terms:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {createdRental.leaseTerms?.replace(/_/g, ' ')}
              </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="yellow.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Created Date:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {new Date(createdRental.createdAt).toLocaleDateString()}
              </Text>
                        </HStack>
                      </SimpleGrid>

                      {createdRental.utilitiesIncluded || createdRental.parkingIncluded || createdRental.petFriendly ? (
                        <Box>
                          <Text fontWeight="semibold" mb={3} fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
                            🏠 Property Features
              </Text>
                          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
                            {createdRental.utilitiesIncluded && (
                              <HStack justify="space-between" p={3} bg="green.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Utilities:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">Included</Text>
                              </HStack>
                            )}
                            {createdRental.parkingIncluded && (
                              <HStack justify="space-between" p={3} bg="blue.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Parking:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">Included</Text>
                              </HStack>
                            )}
                            {createdRental.petFriendly && (
                              <HStack justify="space-between" p={3} bg="orange.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Pet Policy:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">Pet Friendly</Text>
                              </HStack>
                            )}
                          </SimpleGrid>
            </Box>
                      ) : null}
                    </VStack>
        </CardBody>
      </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter bg="gray.50" borderTop="1px" borderColor="gray.200" p={{ base: 4, md: 6 }}>
            <Button 
              colorScheme="brand" 
              onClick={handleSuccessModalClose}
              size="md"
              leftIcon={<FiCheckCircle />}
            >
              View All Rentals
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateNewRental; 