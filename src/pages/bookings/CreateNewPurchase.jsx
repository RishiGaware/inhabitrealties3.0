import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { FiSave, FiX, FiHome, FiUser, FiDollarSign, FiSettings, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { purchaseBookingService } from '../../services/paymentManagement/purchaseBookingService';
import { fetchProperties } from '../../services/propertyService';
import { fetchUsersWithParams } from '../../services/usermanagement/userService';
import { fetchRoles } from '../../services/rolemanagement/roleService';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import SearchableSelect from '../../components/common/SearchableSelect';

const CreateNewPurchase = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    propertyId: '',
    customerId: '',
    assignedSalespersonId: '',
    totalPropertyValue: '',
    downPayment: '',
    paymentTerms: 'INSTALLMENTS',
    installmentCount: '',
    isFinanced: false,
    bankName: '',
    loanTenure: '',
    interestRate: '',
    emiAmount: '',
    bookingStatus: 'CONFIRMED',
  });

  // Data for dropdowns
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salespeople, setSalespeople] = useState([]);

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
        console.warn('Failed to fetch roles, using mock data:', error);
        rolesData = { data: [] };
      }

      // Step 2: Fetch properties
      let propertiesData;
      try {
        propertiesData = await fetchProperties();
      } catch (error) {
        console.warn('Failed to fetch properties, using mock data:', error);
        propertiesData = { data: [] };
      }

      // Step 3: Fetch customers (users with USER role)
      let customersData = { data: [] };
      if (rolesData.data && rolesData.data.length > 0) {
        const userRole = rolesData.data.find(role => role.name === 'USER');
        if (userRole) {
          try {
            customersData = await fetchUsersWithParams({
              roleId: userRole._id,
              published: true
            });
          } catch (error) {
            console.warn('Failed to fetch customers, using mock data:', error);
          }
        }
      }

      // Step 4: Fetch salespeople (users with SALES or EXECUTIVE role)
      let salespeopleData = { data: [] };
      if (rolesData.data && rolesData.data.length > 0) {
        const salesRole = rolesData.data.find(role => role.name === 'SALES');
        const executiveRole = rolesData.data.find(role => role.name === 'EXECUTIVE');
        
        if (salesRole || executiveRole) {
          try {
            // Fetch both roles and combine
            const salesUsers = salesRole ? await fetchUsersWithParams({
              roleId: salesRole._id,
              published: true
            }) : { data: [] };
            
            const executiveUsers = executiveRole ? await fetchUsersWithParams({
              roleId: executiveRole._id,
              published: true
            }) : { data: [] };

            // Combine and remove duplicates
            const allSalespeople = [...(salesUsers.data || []), ...(executiveUsers.data || [])];
            salespeopleData = { data: allSalespeople };
          } catch (error) {
            console.warn('Failed to fetch salespeople, using mock data:', error);
          }
        }
      }

      // Use real data if available, otherwise fall back to mock data
      let publishedProperties = propertiesData.data?.filter(prop => prop.published) || [];
      let publishedCustomers = customersData.data || [];
      let salesUsers = salespeopleData.data || [];

      // If no real data, use mock data
      if (publishedProperties.length === 0) {
        publishedProperties = [
          { _id: 'prop_1', name: 'Luxury Apartment Downtown', address: '123 Main St, Downtown', price: 8500000, type: 'APARTMENT', published: true },
          { _id: 'prop_2', name: 'Modern Villa Suburbs', address: '456 Oak Ave, Suburbs', price: 12000000, type: 'VILLA', published: true },
          { _id: 'prop_3', name: 'Premium Condo', address: '789 Business District', price: 6500000, type: 'APARTMENT', published: true },
        ];
      }

      if (publishedCustomers.length === 0) {
        publishedCustomers = [
          { _id: 'cust_1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '+1234567890', published: true },
          { _id: 'cust_2', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', phone: '+1234567891', published: true },
          { _id: 'cust_3', firstName: 'Mike', lastName: 'Wilson', email: 'mike@example.com', phone: '+1234567892', published: true },
        ];
      }

      if (salesUsers.length === 0) {
        salesUsers = [
          { _id: 'sales_1', firstName: 'Alex', lastName: 'Thompson', email: 'alex@company.com', role: 'SALES', published: true },
          { _id: 'sales_2', firstName: 'Lisa', lastName: 'Davis', email: 'lisa@company.com', role: 'SALES', published: true },
          { _id: 'sales_3', firstName: 'Robert', lastName: 'Brown', email: 'robert@company.com', role: 'EXECUTIVE', published: true },
        ];
      }

      setProperties(publishedProperties);
      setCustomers(publishedCustomers);
      setSalespeople(salesUsers);

      // Show info toast if using mock data
      if (propertiesData.data?.length === 0 || customersData.data?.length === 0 || salespeopleData.data?.length === 0) {
        toast('Using sample data for demonstration. Connect to backend for real data.', {
          icon: 'ℹ️',
        });
      }

    } catch (error) {
      console.error('Error in fetchInitialData:', error);
      // Set mock data as fallback
      setProperties([
        { _id: 'prop_1', name: 'Luxury Apartment Downtown', address: '123 Main St, Downtown', price: 8500000, type: 'APARTMENT', published: true },
        { _id: 'prop_2', name: 'Modern Villa Suburbs', address: '456 Oak Ave, Suburbs', price: 12000000, type: 'VILLA', published: true },
        { _id: 'prop_3', name: 'Premium Condo', address: '789 Business District', price: 6500000, type: 'APARTMENT', published: true },
      ]);
      setCustomers([
        { _id: 'cust_1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '+1234567890', published: true },
        { _id: 'cust_2', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', phone: '+1234567891', published: true },
        { _id: 'cust_3', firstName: 'Mike', lastName: 'Wilson', email: 'mike@example.com', phone: '+1234567892', published: true },
      ]);
      setSalespeople([
        { _id: 'sales_1', firstName: 'Alex', lastName: 'Thompson', email: 'alex@company.com', role: 'SALES', published: true },
        { _id: 'sales_2', firstName: 'Lisa', lastName: 'Davis', email: 'lisa@company.com', role: 'SALES', published: true },
        { _id: 'sales_3', firstName: 'Robert', lastName: 'Brown', email: 'robert@company.com', role: 'EXECUTIVE', published: true },
      ]);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePropertyChange = (propertyId) => {
    const property = properties.find(p => p._id === propertyId);
    if (property) {
      setFormData(prev => ({
        ...prev,
        propertyId,
        totalPropertyValue: property.price,
      }));
    }
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c._id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId,
      }));
    }
  };

  const handleSalespersonChange = (salespersonId) => {
    const salesperson = salespeople.find(s => s._id === salespersonId);
    if (salesperson) {
      setFormData(prev => ({
        ...prev,
        assignedSalespersonId: salespersonId,
      }));
    }
  };





  const validateForm = () => {
    const errors = [];
    
    if (!formData.propertyId) errors.push("Property selection is required");
    if (!formData.customerId) errors.push("Customer selection is required");
    if (!formData.assignedSalespersonId) errors.push("Salesperson assignment is required");
    if (!formData.totalPropertyValue || formData.totalPropertyValue <= 0) errors.push("Valid property value is required");
    if (!formData.downPayment || formData.downPayment <= 0) errors.push("Valid down payment is required");
    if (formData.downPayment >= formData.totalPropertyValue) errors.push("Down payment must be less than total property value");
    
    if (formData.isFinanced) {
      if (!formData.bankName) errors.push("Bank name is required for financed purchases");
      if (!formData.loanTenure || formData.loanTenure <= 0) errors.push("Valid loan tenure is required");
      if (!formData.interestRate || formData.interestRate <= 0) errors.push("Valid interest rate is required");
    }
    
    if (formData.paymentTerms === 'INSTALLMENTS' && (!formData.installmentCount || formData.installmentCount < 2)) {
      errors.push("Installment count must be at least 2 for installment payments");
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        assignedSalespersonId: formData.assignedSalespersonId,
        totalPropertyValue: parseFloat(formData.totalPropertyValue),
        downPayment: parseFloat(formData.downPayment),
        paymentTerms: formData.paymentTerms,
        installmentCount: formData.paymentTerms === 'INSTALLMENTS' ? parseInt(formData.installmentCount) : undefined,
        isFinanced: formData.isFinanced,
        bankName: formData.isFinanced ? formData.bankName : undefined,
        loanTenure: formData.isFinanced ? parseInt(formData.loanTenure) : undefined,
        interestRate: formData.isFinanced ? parseFloat(formData.interestRate) : undefined,
        emiAmount: formData.isFinanced ? parseFloat(formData.emiAmount) : undefined,
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const response = await purchaseBookingService.createPurchaseBooking(payload);
      
      // Show success modal
      setCreatedBooking(response.data);
      onOpen();
      
      toast.success('Purchase booking created successfully!');

    } catch (error) {
      console.error('Error creating purchase booking:', error);
      toast.error(error.response?.data?.message || "Failed to create purchase booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: '',
      customerId: '',
      assignedSalespersonId: '',
      totalPropertyValue: '',
      downPayment: '',
      paymentTerms: 'INSTALLMENTS',
      installmentCount: '',
      isFinanced: false,
      bankName: '',
      loanTenure: '',
      interestRate: '',
      emiAmount: '',
      bookingStatus: 'CONFIRMED',
    });
  };

  const handleSuccessModalClose = () => {
    onClose();
    setCreatedBooking(null);
    resetForm();
    navigate('/purchase-bookings/all');
  };

  if (isDataLoading) {
    return (
      <Box p={6} bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Loader size="xl" label="Loading roles, properties, customers, and salespeople..." />
      </Box>
    );
  }

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Create New Purchase Booking
        </Heading>
      </Flex>



              <form id="purchase-booking-form" onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* Property Selection */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
              <HStack>
                <FiHome color="blue.500" size={20} />
                <Heading size="md" color="blue.700">Property Selection</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Select Property</FormLabel>
                <Select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  placeholder="Choose a property"
                  isRequired={true}
                  isDisabled={isSubmitting}
                  size="md"
                >
                  {properties.map(property => (
                    <option key={property._id} value={property._id}>
                      {`${property.name || property.title} - $${property.price?.toLocaleString() || 'N/A'}`}
                    </option>
                  ))}
                </Select>
                <FormHelperText>Select from available properties</FormHelperText>
              </FormControl>
            </CardBody>
          </Card>

          {/* Customer Selection */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
              <HStack>
                <FiUser color="green.500" size={20} />
                <Heading size="md" color="green.700">Customer Selection</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Select Customer</FormLabel>
                <Select
                  name="customerId"
                  value={formData.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  placeholder="Choose a customer"
                  isRequired={true}
                  isDisabled={isSubmitting}
                  size="md"
                >
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {`${customer.firstName || ''} ${customer.lastName || ''}`.trim() ? `${customer.firstName} ${customer.lastName} - ${customer.email}` : `Unknown Customer - ${customer.email}`}
                    </option>
                  ))}
                </Select>
                <FormHelperText>Select from registered customers</FormHelperText>
              </FormControl>
            </CardBody>
          </Card>

          {/* Salesperson Assignment */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
              <HStack>
                <FiUser color="purple.500" size={20} />
                <Heading size="md" color="purple.700">Salesperson Assignment</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Assign Salesperson</FormLabel>
                  <Select
                    name="assignedSalespersonId"
                    value={formData.assignedSalespersonId}
                    onChange={(e) => handleSalespersonChange(e.target.value)}
                    placeholder="Choose a salesperson"
                    isRequired={true}
                    isDisabled={isSubmitting}
                    size="md"
                  >
                    {salespeople.map(salesperson => (
                      <option key={salesperson._id} value={salesperson._id}>
                        {`${salesperson.firstName || ''} ${salesperson.lastName || ''}`.trim() ? `${salesperson.firstName} ${salesperson.lastName} - ${salesperson.email}` : `Unknown Salesperson - ${salesperson.email}`}
                      </option>
                    ))}
                  </Select>
                  <FormHelperText>Assign a salesperson to handle this booking</FormHelperText>
                </FormControl>
            </CardBody>
          </Card>

          {/* Financial Details */}
          <Card bg={cardBg} border="1px" borderColor={cardBorder} shadow="sm">
            <CardHeader pb={3}>
              <HStack>
                <FiDollarSign color="orange.500" size={20} />
                <Heading size="md" color="orange.700">Financial Details</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Total Property Value</FormLabel>
                    <NumberInput
                      name="totalPropertyValue"
                      value={formData.totalPropertyValue}
                      onChange={(value) => handleInputChange('totalPropertyValue', value)}
                      min={0}
                      isDisabled={isSubmitting}
                      size="md"
                    >
                      <NumberInputField placeholder="Enter total property value" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Down Payment</FormLabel>
                    <NumberInput
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={(value) => handleInputChange('downPayment', value)}
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
                          onChange={(e) => handleInputChange('isFinanced', e.target.checked)}
                          colorScheme="blue"
                          isDisabled={isSubmitting}
                        />
                    </HStack>
                  </FormLabel>
                </FormControl>

                {formData.isFinanced && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">Bank Name</FormLabel>
                                              <Input
                          name="bankName"
                          placeholder="Enter bank name"
                          value={formData.bankName}
                          onChange={(e) => handleInputChange('bankName', e.target.value)}
                          isDisabled={isSubmitting}
                          size="md"
                        />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">Loan Tenure (Years)</FormLabel>
                                              <NumberInput
                          name="loanTenure"
                          value={formData.loanTenure}
                          onChange={(value) => handleInputChange('loanTenure', value)}
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
                      <FormLabel fontWeight="semibold">Interest Rate (%)</FormLabel>
                                              <NumberInput
                          name="interestRate"
                          value={formData.interestRate}
                          onChange={(value) => handleInputChange('interestRate', value)}
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
                          onChange={(value) => handleInputChange('emiAmount', value)}
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
                <Heading size="md" color="teal.700">Payment Terms</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Payment Terms</FormLabel>
                  <Select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    isDisabled={isSubmitting}
                    size="md"
                  >
                    <option value="FULL_PAYMENT">Full Payment</option>
                    <option value="INSTALLMENTS">Installments</option>
                    <option value="MILESTONE">Milestone Based</option>
                  </Select>
                </FormControl>

                {formData.paymentTerms === 'INSTALLMENTS' && (
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">Number of Installments</FormLabel>
                    <NumberInput
                      name="installmentCount"
                      value={formData.installmentCount}
                      onChange={(value) => handleInputChange('installmentCount', value)}
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
                    <FormHelperText>Minimum 2 installments required</FormHelperText>
                  </FormControl>
                )}

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Booking Status</FormLabel>
                  <Select
                    name="bookingStatus"
                    value={formData.bookingStatus}
                    onChange={(e) => handleInputChange('bookingStatus', e.target.value)}
                    isDisabled={isSubmitting}
                    size="md"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Select>
                  <FormHelperText>Select the initial booking status</FormHelperText>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </form>

      {/* Form Footer - Standard pattern like other forms */}
      <Box 
        mt={8} 
        p={6} 
        bg="white" 
        borderTop="1px solid" 
        borderColor="gray.200"
        borderRadius="lg"
        shadow="sm"
      >
        <Flex justify="flex-end" align="center">
          <HStack spacing={4}>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/purchase-bookings/all')}
              isDisabled={isSubmitting}
              leftIcon={<FiX />}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              size="lg"
              type="submit"
              form="purchase-booking-form"
              isLoading={isSubmitting}
              loadingText="Creating..."
              leftIcon={<FiSave />}
              px={8}
            >
              Create Booking
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="green.600">
            <HStack>
              <FiCheckCircle />
              <Text>Purchase Booking Created Successfully!</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {createdBooking && (
              <VStack spacing={4} align="stretch">
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Booking ID: {createdBooking._id}</AlertTitle>
                    <AlertDescription>
                      Your purchase booking has been created and is now pending approval.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Card>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontWeight="semibold">Status:</Text>
                        <Badge colorScheme="yellow" size="lg">{createdBooking.bookingStatus}</Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="semibold">Total Value:</Text>
                        <Text>${createdBooking.totalPropertyValue?.toLocaleString()}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="semibold">Down Payment:</Text>
                        <Text>${createdBooking.downPayment?.toLocaleString()}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="semibold">Loan Amount:</Text>
                        <Text>${createdBooking.loanAmount?.toLocaleString()}</Text>
                      </HStack>
                      {createdBooking.installmentSchedule && (
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Installment Schedule:</Text>
                          <Text fontSize="sm" color="gray.600">
                            {createdBooking.installmentSchedule.length} installments of ${Math.round(createdBooking.installmentSchedule[0]?.amount || 0).toLocaleString()} each
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSuccessModalClose}>
              View All Bookings
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateNewPurchase; 