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
import { FiSave, FiX, FiHome, FiUser, FiCalendar, FiCheckCircle, FiInfo, FiRefreshCw, FiEye } from 'react-icons/fi';
import SearchableSelect from '../../components/common/SearchableSelect';
import Loader from '../../components/common/Loader';
import DocumentUpload from '../../components/common/DocumentUpload';
import PropertyPreview from '../property/propertyMaster/PropertyPreview';
import { rentalBookingService } from '../../services/paymentManagement/rentalBookingService';
import { fetchProperties } from '../../services/propertyService';
import { fetchUsers } from '../../services/usermanagement/userService';
import { fetchRoles } from '../../services/rolemanagement/roleService';
import { fetchPropertyTypes } from '../../services/propertytypes/propertyTypeService';

const CreateNewRental = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState({
    propertyId: "",
    customerId: "",
    assignedSalespersonId: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    securityDeposit: "",
    maintenanceCharges: "",
    advanceRent: "",
    rentDueDate: "",
    notes: "",
    flatNo: "",
    floorNo: "",
    balconies: "",
    otherDetails: "",
  });

  // Data for dropdowns
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  // Selected property details
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Property preview modal
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();

  // Document upload state
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Success modal state
  const [createdRental, setCreatedRental] = useState(null);

  // Loading states
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInitialData = async () => {
    setIsDataLoading(true);
    try {
      // Step 1: Fetch roles first to get role IDs
      const rolesData = await fetchRoles();

      // Step 2: Fetch property types
      const propertyTypesData = await fetchPropertyTypes();
      setPropertyTypes(propertyTypesData.data || []);

      // Step 3: Fetch properties
      const propertiesData = await fetchProperties();

      // Step 4: Fetch all users and filter by role
      const allUsersData = await fetchUsers();

      // Filter users by role on the frontend
      let customersData = { data: [] };
      let salespersonsData = { data: [] };

      if (rolesData.data && rolesData.data.length > 0 && allUsersData.data) {
        const userRole = rolesData.data.find((role) => role.name === "USER");
        const salesRole = rolesData.data.find((role) => role.name === "SALES");
        const executiveRole = rolesData.data.find((role) => role.name === "EXECUTIVE");
        const adminRole = rolesData.data.find((role) => role.name === "ADMIN");
        

        if (userRole) {
          customersData.data = allUsersData.data.filter(user => 
            user.role === userRole._id && user.published === true
          );
        }

        // For salespersons, include SALES, EXECUTIVE, and ADMIN roles
        const salespersonRoles = [salesRole, executiveRole, adminRole].filter(Boolean);
        if (salespersonRoles.length > 0) {
          salespersonsData.data = allUsersData.data.filter(user => 
            salespersonRoles.some(role => user.role === role._id) && user.published === true
          );
        }

      }

      // Use only real data from backend - filter for published properties with FOR RENT status
      const publishedProperties = propertiesData.data?.filter((prop) => 
        prop.published && prop.propertyStatus === "FOR RENT"
      ) || [];
      const publishedCustomers = customersData.data || [];
      const publishedSalespersons = salespersonsData.data || [];

      // Always set the data, even if empty - let the form handle empty states
      setProperties(publishedProperties);
      setCustomers(publishedCustomers);
      setSalespersons(publishedSalespersons);

    } catch (error) {
      console.error("Error in fetchInitialData:", error);
      toast.error("Failed to load required data. Please check your connection and try again.");
      
      // Set empty arrays to prevent form from rendering with invalid data
      setProperties([]);
      setCustomers([]);
      setSalespersons([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePropertyChange = (propertyId) => {
    // Check if dropdown was clicked but is empty
    if (!propertyId && properties.length === 0) {
      toast.error("No properties available for rent. Please add properties with 'FOR RENT' first.");
      return;
    }
    
    const property = properties.find((p) => p._id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setFormData((prev) => ({
        ...prev,
        propertyId,
        monthlyRent: property.price,
        flatNo: "",
        floorNo: "",
        balconies: "",
        otherDetails: "",
      }));
    } else {
      setSelectedProperty(null);
      setFormData((prev) => ({
        ...prev,
        propertyId: "",
        monthlyRent: "",
        flatNo: "",
        floorNo: "",
        balconies: "",
        otherDetails: "",
      }));
    }
  };

  // Check if property is building/apartment type
  const isBuildingType = () => {
    if (!selectedProperty) return false;
    const propertyType = selectedProperty.propertyTypeId;
    if (!propertyType) return false;
    
    const typeName = typeof propertyType === 'object' ? propertyType.typeName : 
                     propertyTypes.find(pt => pt._id === propertyType)?.typeName || '';
    
    const buildingTypes = ['APARTMENT', 'BUILDING', 'FLAT', 'CONDOMINIUM', 'TOWER'];
    return buildingTypes.some(type => typeName?.toUpperCase().includes(type));
  };

  const handleCustomerChange = (customerId) => {
    // Check if dropdown was clicked but is empty
    if (!customerId && customers.length === 0) {
      toast.error("No customers available. Please add customers first.");
      return;
    }
    
    const customer = customers.find((c) => c._id === customerId);
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerId,
      }));
    }
  };

  const handleSalespersonChange = (salespersonId) => {
    // Check if dropdown was clicked but is empty
    if (!salespersonId && salespersons.length === 0) {
      toast.error("No salespersons available. Users need to have the SALES, EXECUTIVE, or ADMIN role assigned.");
      return;
    }
    
    const salesperson = salespersons.find((s) => s._id === salespersonId);
    if (salesperson) {
      setFormData((prev) => ({
        ...prev,
        assignedSalespersonId: salespersonId,
      }));
    }
  };

  const calculateLeaseDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
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
    if (!formData.assignedSalespersonId) errors.push("Salesperson selection is required");
    if (!formData.monthlyRent || formData.monthlyRent <= 0)
      errors.push("Valid monthly rent is required");
    if (!formData.securityDeposit || formData.securityDeposit <= 0)
      errors.push("Valid security deposit is required");
    if (!formData.startDate) errors.push("Lease start date is required");
    if (!formData.endDate) errors.push("Lease end date is required");
    if (!formData.rentDueDate) errors.push("Rent due date is required");

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
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
           formData.assignedSalespersonId &&
           formData.monthlyRent && 
           formData.securityDeposit &&
           formData.startDate &&
           formData.endDate &&
           formData.rentDueDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if SearchableSelect components have values
    if (!formData.propertyId || !formData.customerId || !formData.assignedSalespersonId) {
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
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append('propertyId', formData.propertyId);
      formDataToSend.append('customerId', formData.customerId);
      formDataToSend.append('assignedSalespersonId', formData.assignedSalespersonId);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('monthlyRent', formData.monthlyRent);
      formDataToSend.append('securityDeposit', formData.securityDeposit);
      formDataToSend.append('maintenanceCharges', formData.maintenanceCharges || 0);
      formDataToSend.append('advanceRent', formData.advanceRent || 0);
      formDataToSend.append('rentDueDate', formData.rentDueDate);
      formDataToSend.append('notes', formData.notes);

      // Add documents if any are selected
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((fileObj, index) => {
          formDataToSend.append('documents', fileObj.file);
          formDataToSend.append(`documentTypes[${index}]`, fileObj.documentType);
        });
      }

      // Use the rental booking service with FormData
      const response = await rentalBookingService.createRentalBooking(formDataToSend);

      // Show success modal
      setCreatedRental(response.data);
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
      assignedSalespersonId: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      securityDeposit: "",
      maintenanceCharges: "",
      advanceRent: "",
      rentDueDate: "",
      notes: "",
      flatNo: "",
      floorNo: "",
      balconies: "",
      otherDetails: "",
    });
    setSelectedProperty(null);
    setSelectedFiles([]); // Reset selected files
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
          label="Loading roles, properties, and customers..."
        />
      </Box>
    );
  }

  // Always show the form - let dropdowns handle empty states

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
                  onOpen={() => {
                    if (properties.length === 0) {
                      toast.error("No properties available for rent. Please add properties with 'FOR RENT' first.");
                    }
                  }}
                  options={properties.map(property => ({
                    value: property._id,
                    label: `${property.name || property.title} - ₹${property.price?.toLocaleString() || 'N/A'}`
                  }))}
                  isDisabled={isSubmitting}
                  isRequired={true}
                />
                <FormHelperText>
                  Search and select from available properties for rent
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
                    <HStack justify="space-between" w="full">
                      <HStack>
                        <FiInfo color="blue.600" />
                        <Text fontWeight="semibold" color="blue.800" fontSize={{ base: 'sm', md: 'md' }}>Selected Property Details</Text>
                      </HStack>
                      <Button
                        leftIcon={<FiEye />}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={onPreviewOpen}
                        _hover={{ bg: "blue.100" }}
                      >
                        View Full Details
                      </Button>
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
                          <Text fontSize="sm" color="gray.700">
                            {selectedProperty.propertyTypeId?.typeName || selectedProperty.type || 'N/A'}
                          </Text>
                        </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack spacing={2} align="stretch">
                          <HStack>
                            <FiHome color="blue.600" size={16} />
                            <Text fontWeight="medium">Address</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">
                            {selectedProperty.propertyAddress ? 
                              `${selectedProperty.propertyAddress.street || ''} ${selectedProperty.propertyAddress.area || ''}, ${selectedProperty.propertyAddress.city || ''}, ${selectedProperty.propertyAddress.state || ''}`.trim() || 'Address not available'
                              : selectedProperty.address || 'Address not available'}
                          </Text>
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

                      {selectedProperty.features && (
                        <>
                          <GridItem>
                            <VStack spacing={2} align="stretch">
                              <HStack>
                                <FiHome color="blue.600" size={16} />
                                <Text fontWeight="medium">Bedrooms</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.700">
                                {selectedProperty.features.bedRooms || 0}
                              </Text>
                            </VStack>
                          </GridItem>

                          <GridItem>
                            <VStack spacing={2} align="stretch">
                              <HStack>
                                <FiHome color="blue.600" size={16} />
                                <Text fontWeight="medium">Bathrooms</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.700">
                                {selectedProperty.features.bathRooms || 0}
                              </Text>
                            </VStack>
                          </GridItem>

                          <GridItem>
                            <VStack spacing={2} align="stretch">
                              <HStack>
                                <FiHome color="blue.600" size={16} />
                                <Text fontWeight="medium">Area</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.700">
                                {selectedProperty.features.areaInSquarFoot || 0} sq ft
                              </Text>
                            </VStack>
                          </GridItem>

                          {selectedProperty.features.bhk && (
                            <GridItem>
                              <VStack spacing={2} align="stretch">
                                <HStack>
                                  <FiHome color="blue.600" size={16} />
                                  <Text fontWeight="medium">BHK</Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.700">
                                  {selectedProperty.features.bhk} BHK
                                </Text>
                              </VStack>
                            </GridItem>
                          )}
                        </>
                      )}

                      {selectedProperty.description && (
                        <GridItem colSpan={{ base: 1, sm: 2 }}>
                          <VStack spacing={2} align="stretch">
                            <Text fontWeight="medium">Description</Text>
                            <Text fontSize="sm" color="gray.700" noOfLines={3}>
                              {selectedProperty.description}
                            </Text>
                          </VStack>
                        </GridItem>
                      )}
                    </Grid>
                  </VStack>
                </Box>
              )}

              {/* Building/Apartment Specific Fields */}
              {selectedProperty && isBuildingType() && (
                <Box mt={4} p={{ base: 3, md: 4 }} bg="purple.50" borderRadius="md" border="1px" borderColor="purple.200">
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <FiInfo color="purple.600" />
                      <Text fontWeight="semibold" color="purple.800" fontSize={{ base: 'sm', md: 'md' }}>
                        Building/Apartment Details
                      </Text>
                    </HStack>
                    
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }}>
                      <FormControl>
                        <FormLabel fontWeight="semibold">Flat/Apartment Number</FormLabel>
                        <Input
                          name="flatNo"
                          placeholder="e.g., A-101, 2B, etc."
                          value={formData.flatNo}
                          onChange={(e) => handleInputChange("flatNo", e.target.value)}
                          isDisabled={isSubmitting}
                          size="md"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontWeight="semibold">Floor Number</FormLabel>
                        <NumberInput
                          name="floorNo"
                          value={formData.floorNo}
                          onChange={(value) => handleInputChange("floorNo", value)}
                          min={0}
                          isDisabled={isSubmitting}
                          size="md"
                        >
                          <NumberInputField placeholder="Enter floor number" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontWeight="semibold">Number of Balconies</FormLabel>
                        <NumberInput
                          name="balconies"
                          value={formData.balconies}
                          onChange={(value) => handleInputChange("balconies", value)}
                          min={0}
                          isDisabled={isSubmitting}
                          size="md"
                        >
                          <NumberInputField placeholder="Enter number of balconies" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Other Details</FormLabel>
                      <Input
                        name="otherDetails"
                        placeholder="Any additional details about the flat/apartment"
                        value={formData.otherDetails}
                        onChange={(e) => handleInputChange("otherDetails", e.target.value)}
                        isDisabled={isSubmitting}
                        size="md"
                      />
                      <FormHelperText>Optional: Add any other relevant details about this specific unit</FormHelperText>
                    </FormControl>
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
                  onOpen={() => {
                    if (customers.length === 0) {
                      toast.error("No customers available. Please add customers first.");
                    }
                  }}
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

          {/* Salesperson Selection */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
                <HStack>
                <FiUser color="purple.500" size={20} />
                <Heading size="md" color="purple.700">
                  Salesperson Assignment
                </Heading>
                </HStack>
              </CardHeader>
            <CardBody pt={0}>
                <FormControl isRequired>
                <FormLabel fontWeight="semibold">Select Salesperson</FormLabel>
                <SearchableSelect
                  name="assignedSalespersonId"
                  placeholder="Search and choose a salesperson"
                  value={formData.assignedSalespersonId}
                  onChange={handleSalespersonChange}
                  onOpen={() => {
                    if (salespersons.length === 0) {
                      toast.error("No salespersons available. Users need to have the SALES, EXECUTIVE, or ADMIN role assigned.");
                    }
                  }}
                  options={salespersons.map(salesperson => ({
                    value: salesperson._id,
                    label: `${salesperson.firstName || ""} ${
                      salesperson.lastName || ""
                    }`.trim()
                      ? `${salesperson.firstName} ${salesperson.lastName} - ${salesperson.email}`
                      : `Unknown Salesperson - ${salesperson.email}`
                  }))}
                  isDisabled={isSubmitting}
                  isRequired={true}
                />
                <FormHelperText>
                  Search and select from available salespersons
                </FormHelperText>
                {!formData.assignedSalespersonId && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    Salesperson selection is required
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
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      isDisabled={isSubmitting}
                      size="md"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Lease End Date</FormLabel>
                    <Input
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      isDisabled={isSubmitting}
                      size="md"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }} w="full">
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Rent Due Date</FormLabel>
                    <NumberInput
                      name="rentDueDate"
                      value={formData.rentDueDate}
                      onChange={(value) => handleInputChange("rentDueDate", value)}
                      min={1}
                      max={31}
                      isDisabled={isSubmitting}
                      size="md"
                    >
                      <NumberInputField placeholder="Enter day of month (1-31)" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>Enter the day of the month when rent is due (1-31)</FormHelperText>
                    {formData.rentDueDate && (
                      <Text fontSize="sm" color="blue.600" mt={1}>
                        Rent will be due on the {formData.rentDueDate}th of each month
                      </Text>
                    )}
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

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }} w="full">
                  <FormControl>
                    <FormLabel fontWeight="semibold">Maintenance Charges (₹)</FormLabel>
                    <NumberInput
                      name="maintenanceCharges"
                      value={formData.maintenanceCharges}
                      onChange={(value) =>
                        handleInputChange("maintenanceCharges", value)
                      }
                      min={0}
                          isDisabled={isSubmitting}
                      size="md"
                    >
                      <NumberInputField placeholder="Enter maintenance charges" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>Monthly maintenance charges (optional)</FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold">Advance Rent (months)</FormLabel>
                    <NumberInput
                      name="advanceRent"
                      value={formData.advanceRent}
                      onChange={(value) =>
                        handleInputChange("advanceRent", value)
                      }
                      min={0}
                          isDisabled={isSubmitting}
                      size="md"
                    >
                      <NumberInputField placeholder="Enter advance rent months" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>Number of months of advance rent paid (optional)</FormHelperText>
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

          {/* Document Upload */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
              <HStack>
                <FiInfo color="purple.500" size={20} />
                <Heading size="md" color="purple.700">
                  Upload Documents
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <DocumentUpload
                files={selectedFiles}
                onFilesChange={setSelectedFiles}
                maxFiles={10}
                maxFileSize={10 * 1024 * 1024} // 10MB
                allowedTypes={['pdf']} // Only PDF files allowed
                documentTypes={[
                  'RENTAL_AGREEMENT', 
                  'CONTRACT', 
                  'ID_PROOF', 
                  'ADDRESS_PROOF', 
                  'INCOME_PROOF', 
                  'BANK_STATEMENT', 
                  'OTHER'
                ]}
                isDisabled={isSubmitting}
                title="Rental Documents (PDF Only)"
                description="Upload PDF documents like rental agreements, contracts, ID proof, address proof, income proof, bank statements, or other supporting documents. Only PDF files are accepted."
              />
              </CardBody>
            </Card>

          {/* Submit Button */}
          <Box textAlign="center" pt={4}>
            <HStack spacing={4} justify="flex-end">
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

      {/* Property Preview Modal */}
      {selectedProperty && (
        <PropertyPreview
          isOpen={isPreviewOpen}
          onClose={onPreviewClose}
          property={selectedProperty}
          isViewOnly={true}
        />
      )}

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size={{ base: "full", sm: "4xl" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent mx={{ base: 2, sm: 0 }} maxH={{ base: "100vh", sm: "90vh" }} overflow="hidden">
          <ModalHeader bg="green.500" color="white" borderRadius="lg">
            <HStack justify="space-between" w="full">
            <HStack>
              <FiCheckCircle />
              <Text>Rental Booking Created Successfully! 🎉</Text>
              </HStack>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "green.600" }}
                onClick={handleModalClose}
                size="sm"
                p={1}
                minW="auto"
              >
                <FiX size={20} />
              </Button>
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
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Booking ID:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {createdRental.bookingId}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="purple.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Status:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {createdRental.bookingStatus}
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
                            {new Date(createdRental.startDate).toLocaleDateString()}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="red.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Lease End:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {new Date(createdRental.endDate).toLocaleDateString()}
                          </Text>
                        </HStack>
                      </SimpleGrid>

                      <HStack justify="space-between" p={3} bg="teal.50" borderRadius="md">
                        <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Lease Duration:</Text>
                        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="teal.600">
                          {createdRental.duration} months
                        </Text>
                      </HStack>

                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <HStack justify="space-between" p={3} bg="purple.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Rent Due Date:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {createdRental.rentDueDate}th of each month
              </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="yellow.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Created Date:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {new Date(createdRental.createdAt).toLocaleDateString()}
              </Text>
                        </HStack>
                      </SimpleGrid>

                      {(createdRental.maintenanceCharges > 0 || createdRental.advanceRent > 0) && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
                            💰 Additional Charges
              </Text>
                          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                            {createdRental.maintenanceCharges > 0 && (
                              <HStack justify="space-between" p={3} bg="green.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Maintenance Charges:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">₹{createdRental.maintenanceCharges?.toLocaleString()}/month</Text>
                              </HStack>
                            )}
                            {createdRental.advanceRent > 0 && (
                              <HStack justify="space-between" p={3} bg="blue.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Advance Rent:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">{createdRental.advanceRent} months</Text>
                              </HStack>
                            )}
                          </SimpleGrid>
            </Box>
                      )}

                      {/* Uploaded Documents Information */}
                      {createdRental.documents && createdRental.documents.length > 0 && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
                            📎 Uploaded Documents
                          </Text>
                          <VStack spacing={2} align="stretch">
                            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600" textAlign="center">
                              {createdRental.documents.length} document(s) uploaded successfully
                            </Text>
                            <Box 
                              maxH={{ base: "150px", md: "200px" }} 
                              overflowY="auto" 
                              border="1px" 
                              borderColor="gray.200" 
                              borderRadius="lg" 
                              p={3}
                              bg="gray.50"
                            >
                              {createdRental.documents.map((document, index) => (
                                <HStack 
                                  key={document._id || index} 
                                  justify="space-between" 
                                  py={2} 
                                  px={2}
                                  borderBottom={index < createdRental.documents.length - 1 ? "1px solid" : "none"} 
                                  borderColor="gray.200"
                                  bg="white"
                                  borderRadius="md"
                                  _hover={{ bg: "gray.50" }}
                                >
                                  <VStack align="start" spacing={0}>
                                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium">
                                      {document.originalName}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Type: {document.documentType?.replace(/_/g, ' ')}
                                    </Text>
                                  </VStack>
                                  <Text fontSize="xs" color="green.600" fontWeight="medium">
                                    ✓ Uploaded
                                  </Text>
                                </HStack>
                              ))}
                            </Box>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
        </CardBody>
      </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter bg="gray.50" borderTop="1px" borderColor="gray.200" p={{ base: 4, md: 6 }}>
            <Button 
              colorScheme="brand" 
              // onClick={handleSuccessModalClose}
              size="md"
              leftIcon={<FiCheckCircle />}
            >
              Created Successfully
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateNewRental; 