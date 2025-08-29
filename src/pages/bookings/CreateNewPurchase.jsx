import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Note: React Router warnings about v7_startTransition and v7_relativeSplatPath are just future compatibility warnings
// and don't affect current functionality. They can be addressed when upgrading to React Router v7.
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
  SimpleGrid,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorModeValue,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FiSave,
  FiX,
  FiHome,
  FiUser,
  FiDollarSign,
  FiSettings,
  FiCalendar,
  FiCheckCircle,
  FiMapPin,
  FiInfo,
} from "react-icons/fi";
import { purchaseBookingService } from "../../services/paymentManagement/purchaseBookingService";
import { fetchProperties } from "../../services/propertyService";
import { fetchUsersWithParams } from "../../services/usermanagement/userService";
import { fetchRoles } from "../../services/rolemanagement/roleService";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import SearchableSelect from "../../components/common/SearchableSelect";

const CreateNewPurchase = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    propertyId: "",
    customerId: "",
    totalPropertyValue: "",
    downPayment: "",
    paymentTerms: "INSTALLMENTS",
    installmentCount: "",
    isFinanced: false,
    bankName: "",
    loanTenure: "",
    interestRate: "",
    emiAmount: "",
    bookingStatus: "CONFIRMED",
  });

  // Data for dropdowns
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Selected property details
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Success modal state
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsDataLoading(true);
    try {
      // Step 1: Fetch roles first to get role IDs
      let rolesData;
      try {
        rolesData = await fetchRoles();
      } catch (error) {
        console.warn("Failed to fetch roles, using mock data:", error);
        rolesData = { data: [] };
      }

      // Step 2: Fetch properties
      let propertiesData;
      try {
        propertiesData = await fetchProperties();
      } catch (error) {
        console.warn("Failed to fetch properties, using mock data:", error);
        propertiesData = { data: [] };
      }

      // Step 3: Fetch customers (users with USER role)
      let customersData = { data: [] };
      if (rolesData.data && rolesData.data.length > 0) {
        const userRole = rolesData.data.find((role) => role.name === "USER");
        if (userRole) {
          try {
            customersData = await fetchUsersWithParams({
              roleId: userRole._id,
              published: true,
            });
          } catch (error) {
            console.warn("Failed to fetch customers, using mock data:", error);
          }
        }
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
            name: "Luxury Apartment Downtown",
            address: "123 Main St, Downtown",
            price: 8500000,
            type: "APARTMENT",
            published: true,
          },
          {
            _id: "prop_2",
            name: "Modern Villa Suburbs",
            address: "456 Oak Ave, Suburbs",
            price: 12000000,
            type: "VILLA",
            published: true,
          },
          {
            _id: "prop_3",
            name: "Premium Condo",
            address: "789 Business District",
            price: 6500000,
            type: "APARTMENT",
            published: true,
          },
        ];
      }

      if (publishedCustomers.length === 0) {
        publishedCustomers = [
          {
            _id: "cust_1",
            firstName: "John",
            lastName: "Smith",
            email: "john@example.com",
            phone: "+1234567890",
            published: true,
          },
          {
            _id: "cust_2",
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah@example.com",
            phone: "+1234567891",
            published: true,
          },
          {
            _id: "cust_3",
            firstName: "Mike",
            lastName: "Wilson",
            email: "mike@example.com",
            phone: "+1234567892",
            published: true,
          },
        ];
      }



      setProperties(publishedProperties);
      setCustomers(publishedCustomers);

      // Show info toast if using mock data
      if (
        propertiesData.data?.length === 0 ||
        customersData.data?.length === 0
      ) {
        toast(
          "Using sample data for demonstration. Connect to backend for real data.",
          {
            icon: "ℹ️",
          }
        );
      }
    } catch (error) {
      console.error("Error in fetchInitialData:", error);
      // Set mock data as fallback
      setProperties([
        {
          _id: "prop_1",
          name: "Luxury Apartment Downtown",
          address: "123 Main St, Downtown",
          price: 8500000,
          type: "APARTMENT",
          published: true,
        },
        {
          _id: "prop_2",
          name: "Modern Villa Suburbs",
          address: "456 Oak Ave, Suburbs",
          price: 12000000,
          type: "VILLA",
          published: true,
        },
        {
          _id: "prop_3",
          name: "Premium Condo",
          address: "789 Business District",
          price: 6500000,
          type: "APARTMENT",
          published: true,
        },
      ]);
      setCustomers([
        {
          _id: "cust_1",
          firstName: "John",
          lastName: "Smith",
          email: "john@example.com",
          phone: "+1234567890",
          published: true,
        },
        {
          _id: "cust_2",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah@example.com",
          phone: "+1234567891",
          published: true,
        },
        {
          _id: "cust_3",
          firstName: "Mike",
          lastName: "Wilson",
          email: "mike@example.com",
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
        totalPropertyValue: property.price,
      }));
    } else {
      setSelectedProperty(null);
      setFormData((prev) => ({
        ...prev,
        propertyId: "",
        totalPropertyValue: "",
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



  const formatAddress = (property) => {
    if (!property.propertyAddress) return 'Address not available';
    
    const addr = property.propertyAddress;
    const parts = [
      addr.street,
      addr.area,
      addr.city,
      addr.state,
      addr.zipOrPinCode,
      addr.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const formatFeatures = (property) => {
    if (!property.features) return 'Features not available';
    
    const features = property.features;
    const parts = [];
    
    if (features.bedRooms > 0) parts.push(`${features.bedRooms} Bedrooms`);
    if (features.bathRooms > 0) parts.push(`${features.bathRooms} Bathrooms`);
    if (features.areaInSquarFoot > 0) parts.push(`${features.areaInSquarFoot} sq ft`);
    
    return parts.join(' • ');
  };

  const formatAmenities = (property) => {
    if (!property.features?.amenities || property.features.amenities.length === 0) {
      return 'No amenities listed';
    }
    
    return property.features.amenities.join(', ');
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.propertyId) errors.push("Property selection is required");
    if (!formData.customerId) errors.push("Customer selection is required");
    if (!formData.totalPropertyValue || formData.totalPropertyValue <= 0)
      errors.push("Valid property value is required");
    if (!formData.downPayment || formData.downPayment <= 0)
      errors.push("Valid down payment is required");
    if (formData.downPayment >= formData.totalPropertyValue)
      errors.push("Down payment must be less than total property value");

    if (formData.isFinanced) {
      if (!formData.bankName)
        errors.push("Bank name is required for financed purchases");
      if (!formData.loanTenure || formData.loanTenure <= 0)
        errors.push("Valid loan tenure is required");
      if (!formData.interestRate || formData.interestRate <= 0)
        errors.push("Valid interest rate is required");
    }

    if (
      formData.paymentTerms === "INSTALLMENTS" &&
      (!formData.installmentCount || formData.installmentCount < 2)
    ) {
      errors.push(
        "Installment count must be at least 2 for installment payments"
      );
    }

    return errors;
  };

  // Prevent form submission if required fields are empty
  const isFormValid = () => {
    return formData.propertyId && 
           formData.customerId && 
           formData.totalPropertyValue && 
           formData.downPayment;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if SearchableSelect components have values
    if (!formData.propertyId || !formData.customerId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the API payload
      const payload = {
        propertyId: formData.propertyId,
        customerId: formData.customerId,
        bookingStatus: formData.bookingStatus,
        totalPropertyValue: parseFloat(formData.totalPropertyValue),
        downPayment: parseFloat(formData.downPayment),
        paymentTerms: formData.paymentTerms,
        installmentCount:
          formData.paymentTerms === "INSTALLMENTS"
            ? parseInt(formData.installmentCount)
            : undefined,
        isFinanced: formData.isFinanced,
        bankName: formData.isFinanced ? formData.bankName : undefined,
        loanTenure: formData.isFinanced
          ? parseInt(formData.loanTenure)
          : undefined,
        interestRate: formData.isFinanced
          ? parseFloat(formData.interestRate)
          : undefined,
        emiAmount: formData.isFinanced
          ? parseFloat(formData.emiAmount)
          : undefined,
      };

      // Remove undefined values
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      const response = await purchaseBookingService.createPurchaseBooking(
        payload
      );

      // Show success modal
      setCreatedBooking(response.data);
      onOpen();

      toast.success("Purchase booking created successfully!");
    } catch (error) {
      console.error("Error creating purchase booking:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create purchase booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: "",
      customerId: "",
      totalPropertyValue: "",
      downPayment: "",
      paymentTerms: "INSTALLMENTS",
      installmentCount: "",
      isFinanced: false,
      bankName: "",
      loanTenure: "",
      interestRate: "",
      emiAmount: "",
      bookingStatus: "CONFIRMED",
    });
    setSelectedProperty(null);
  };

  const handleSuccessModalClose = () => {
    onClose();
    setCreatedBooking(null);
    resetForm();
    navigate("/purchase-bookings/all");
  };

  const handleModalClose = () => {
    onClose();
    setCreatedBooking(null);
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

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 0 }}>
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
          Create New Purchase Booking
        </Heading>
      </Flex>

      <form id="purchase-booking-form" onSubmit={handleSubmit} noValidate>
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
                            <FiDollarSign color="blue.600" size={16} />
                            <Text fontWeight="medium">Price</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                            ₹{selectedProperty.price?.toLocaleString()}
                          </Text>
                        </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack spacing={2} align="stretch">
                          <HStack>
                            <FiMapPin color="blue.600" size={16} />
                            <Text fontWeight="medium">Address</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">{formatAddress(selectedProperty)}</Text>
                        </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack spacing={2} align="stretch">
                          <HStack>
                            <FiInfo color="blue.600" size={16} />
                            <Text fontWeight="medium">Features</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">{formatFeatures(selectedProperty)}</Text>
                        </VStack>
                      </GridItem>

                      <GridItem colSpan={{ base: 1, md: 2 }}>
                        <VStack spacing={2} align="stretch">
                          <HStack>
                            <FiSettings color="blue.600" size={16} />
                            <Text fontWeight="medium">Amenities</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">{formatAmenities(selectedProperty)}</Text>
                        </VStack>
                      </GridItem>

                      {selectedProperty.description && (
                        <GridItem colSpan={{ base: 1, md: 2 }}>
                          <VStack spacing={2} align="stretch">
                            <Text fontWeight="medium">Description</Text>
                            <Text fontSize="sm" color="gray.700">{selectedProperty.description}</Text>
                          </VStack>
                        </GridItem>
                      )}
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



          {/* Financial Details */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
              <HStack>
                <FiDollarSign color="orange.500" size={20} />
                <Heading size="md" color="orange.700">
                  Financial Details
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }} w="full">
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">
                      Total Property Value
                    </FormLabel>
                    <NumberInput
                      name="totalPropertyValue"
                      value={formData.totalPropertyValue}
                      isReadOnly={true}
                      size="md"
                    >
                      <NumberInputField 
                        placeholder="Property value will be set automatically" 
                        bg="gray.100"
                        _readOnly={{
                          bg: "gray.100",
                          cursor: "not-allowed"
                        }}
                      />
                    </NumberInput>
                    <FormHelperText>This value is automatically set from the selected property (in ₹)</FormHelperText>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Down Payment</FormLabel>
                    <NumberInput
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={(value) =>
                        handleInputChange("downPayment", value)
                      }
                      min={0}
                      max={formData.totalPropertyValue}
                      isDisabled={isSubmitting}
                      size="md"
                    >
                      <NumberInputField placeholder="Enter down payment amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text fontWeight="semibold">Financed Purchase</Text>
                      <Switch
                        name="isFinanced"
                        isChecked={formData.isFinanced}
                        onChange={(e) =>
                          handleInputChange("isFinanced", e.target.checked)
                        }
                        colorScheme="blue"
                        isDisabled={isSubmitting}
                      />
                    </HStack>
                  </FormLabel>
                </FormControl>

                {formData.isFinanced && (
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }} w="full">
                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">Bank Name</FormLabel>
                      <Input
                        name="bankName"
                        placeholder="Enter bank name"
                        value={formData.bankName}
                        onChange={(e) =>
                          handleInputChange("bankName", e.target.value)
                        }
                        isDisabled={isSubmitting}
                        size="md"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">
                        Loan Tenure (Years)
                      </FormLabel>
                      <NumberInput
                        name="loanTenure"
                        value={formData.loanTenure}
                        onChange={(value) =>
                          handleInputChange("loanTenure", value)
                        }
                        min={1}
                        max={30}
                        isDisabled={isSubmitting}
                        size="md"
                      >
                        <NumberInputField placeholder="Enter loan tenure" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">
                        Interest Rate (%)
                      </FormLabel>
                      <NumberInput
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={(value) =>
                          handleInputChange("interestRate", value)
                        }
                        min={0}
                        max={20}
                        step={0.1}
                        isDisabled={isSubmitting}
                        size="md"
                      >
                        <NumberInputField placeholder="Enter interest rate" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">EMI Amount</FormLabel>
                      <NumberInput
                        name="emiAmount"
                        value={formData.emiAmount}
                        onChange={(value) =>
                          handleInputChange("emiAmount", value)
                        }
                        min={0}
                        isDisabled={isSubmitting}
                        size="md"
                      >
                        <NumberInputField placeholder="Enter EMI amount" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Payment Terms */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
              <HStack>
                <FiSettings color="teal.500" size={20} />
                <Heading size="md" color="teal.700">
                  Payment Terms
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Payment Terms</FormLabel>
                  <Select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      handleInputChange("paymentTerms", e.target.value)
                    }
                    isDisabled={isSubmitting}
                    size="md"
                  >
                    <option value="FULL_PAYMENT">Full Payment</option>
                    <option value="INSTALLMENTS">Installments</option>
                    <option value="MILESTONE">Milestone Based</option>
                  </Select>
                </FormControl>

                {formData.paymentTerms === "INSTALLMENTS" && (
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">
                      Number of Installments
                    </FormLabel>
                    <NumberInput
                      name="installmentCount"
                      value={formData.installmentCount}
                      onChange={(value) =>
                        handleInputChange("installmentCount", value)
                      }
                      min={2}
                      max={60}
                      isDisabled={isSubmitting}
                      size="md"
                    >
                      <NumberInputField placeholder="Enter number of installments" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>
                      Minimum 2 installments required
                    </FormHelperText>
                  </FormControl>
                )}

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Booking Status</FormLabel>
                  <Select
                    name="bookingStatus"
                    value={formData.bookingStatus}
                    onChange={(e) =>
                      handleInputChange("bookingStatus", e.target.value)
                    }
                    isDisabled={isSubmitting}
                    size="md"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Select>
                  <FormHelperText>
                    Select the initial booking status
                  </FormHelperText>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </form>

      {/* Form Footer - Standard pattern like other forms */}
      <Box
        mt={{ base: 6, md: 8 }}
        p={{ base: 4, md: 6 }}
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        shadow="sm"
      >
        <Flex justify="flex-end" align="center" gap={3}>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/purchase-bookings/all")} 
            disabled={isSubmitting}
            size="md"
          >
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            type="submit"
            form="purchase-booking-form"
            isLoading={isSubmitting}
            loadingText="Creating..."
            isDisabled={!isFormValid() || isSubmitting}
            size="md"
          >
            Create Booking
          </Button>
        </Flex>
      </Box>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size={{ base: "full", sm: "xl" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent mx={{ base: 2, sm: 0 }} maxH={{ base: "100vh", sm: "90vh" }} overflow="hidden">
          <ModalHeader color="green.600" bg="green.50" borderBottom="1px" borderColor="green.200">
            <HStack spacing={3}>
              <Box p={2} bg="green.100" borderRadius="full">
                <FiCheckCircle size={24} color="#059669" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">Purchase Booking Created Successfully!</Text>
                <Text fontSize="sm" color="green.700">Your booking is now pending approval</Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton onClick={handleModalClose} size="lg" />
          <ModalBody p={{ base: 4, md: 6 }} overflowY="auto">
            {createdBooking && (
              <VStack spacing={4} align="stretch">
                <Alert status="success" borderRadius="lg" variant="subtle">
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize={{ base: 'sm', md: 'md' }}>Booking ID: {createdBooking._id}</AlertTitle>
                    <AlertDescription fontSize={{ base: 'xs', md: 'sm' }}>
                      Your purchase booking has been created successfully and is now pending approval.
                    </AlertDescription>
                  </Box>
                </Alert>

                <Card shadow="md" borderRadius="lg">
                  <CardBody p={{ base: 4, md: 6 }}>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Status:</Text>
                          <Badge colorScheme="yellow" size={{ base: 'md', md: 'lg' }} variant="subtle">
                            {createdBooking.bookingStatus}
                          </Badge>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Payment Terms:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                            {createdBooking.paymentTerms}
                          </Text>
                        </HStack>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <HStack justify="space-between" p={3} bg="blue.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Total Value:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="blue.600">
                            ₹{createdBooking.totalPropertyValue?.toLocaleString()}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="green.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Down Payment:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="green.600">
                            ₹{createdBooking.downPayment?.toLocaleString()}
                          </Text>
                        </HStack>
                      </SimpleGrid>

                      <HStack justify="space-between" p={3} bg="purple.50" borderRadius="md">
                        <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Loan Amount:</Text>
                        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="purple.600">
                          ₹{createdBooking.loanAmount?.toLocaleString()}
                        </Text>
                      </HStack>

                      {createdBooking.installmentCount && (
                        <HStack justify="space-between" p={3} bg="orange.50" borderRadius="md">
                          <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>Installment Count:</Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="orange.600">
                            {createdBooking.installmentCount}
                          </Text>
                        </HStack>
                      )}

                      {createdBooking.installmentSchedule && createdBooking.installmentSchedule.length > 0 && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
                            📅 Installment Schedule
                          </Text>
                          <VStack spacing={3} align="stretch">
                            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600" textAlign="center">
                              {createdBooking.installmentSchedule.length} installments of ₹
                              {createdBooking.installmentSchedule[0]?.amount?.toLocaleString()} each
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
                              {createdBooking.installmentSchedule.map((installment, index) => (
                                <HStack 
                                  key={installment._id} 
                                  justify="space-between" 
                                  py={2} 
                                  px={2}
                                  borderBottom={index < createdBooking.installmentSchedule.length - 1 ? "1px solid" : "none"} 
                                  borderColor="gray.200"
                                  bg="white"
                                  borderRadius="md"
                                  _hover={{ bg: "gray.50" }}
                                >
                                  <VStack align="start" spacing={0}>
                                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium">
                                      Installment {installment.installmentNumber}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Due: {new Date(installment.dueDate).toLocaleDateString()}
                                    </Text>
                                  </VStack>
                                  <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="blue.600">
                                    ₹{installment.amount?.toLocaleString()}
                                  </Text>
                                </HStack>
                              ))}
                            </Box>
                          </VStack>
                        </Box>
                      )}

                      {createdBooking.isFinanced && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
                            🏦 Loan Details
                          </Text>
                          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                            {createdBooking.bankName && (
                              <HStack justify="space-between" p={3} bg="teal.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Bank:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">{createdBooking.bankName}</Text>
                              </HStack>
                            )}
                            {createdBooking.loanTenure && (
                              <HStack justify="space-between" p={3} bg="teal.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Loan Tenure:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">{createdBooking.loanTenure} years</Text>
                              </HStack>
                            )}
                            {createdBooking.interestRate && (
                              <HStack justify="space-between" p={3} bg="teal.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Interest Rate:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">{createdBooking.interestRate}%</Text>
                              </HStack>
                            )}
                            {createdBooking.emiAmount && (
                              <HStack justify="space-between" p={3} bg="teal.50" borderRadius="md">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>EMI Amount:</Text>
                                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="teal.600">₹{createdBooking.emiAmount?.toLocaleString()}</Text>
                              </HStack>
                            )}
                          </SimpleGrid>
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
              onClick={handleSuccessModalClose}
              size="md"
              leftIcon={<FiCheckCircle />}
            >
              View All Bookings
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateNewPurchase;
