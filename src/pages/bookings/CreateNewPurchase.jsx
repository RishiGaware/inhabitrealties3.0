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
  Textarea,
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
  Divider,
  useToast,
  useColorModeValue,
  SimpleGrid,
  Badge,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiSave, FiX, FiPlus, FiTrash2, FiSettings, FiHome, FiUser, FiDollarSign } from 'react-icons/fi';

const CreateNewPurchase = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Form state
  const [formData, setFormData] = useState({
    // Property Details
    propertyId: '',
    propertyTitle: '',
    propertyAddress: '',
    propertyType: '',
    propertyPrice: '',
    
    // Customer Details
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // Salesperson Details
    assignedSalespersonId: '',
    salespersonName: '',
    
    // Financial Details
    totalPropertyValue: '',
    downPayment: '',
    loanAmount: '',
    isFinanced: false,
    bankName: '',
    loanTenure: '',
    interestRate: '',
    emiAmount: '',
    
    // Payment Terms
    paymentTerms: 'INSTALLMENTS',
    installmentCount: '',
    
    // Additional Details
    expectedCompletionDate: '',
    notes: '',
  });

  // Mock data for dropdowns
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salespeople, setSalespeople] = useState([]);

  useEffect(() => {
    // Mock data
    setProperties([
      { _id: 'prop_1', title: 'Luxury Apartment Downtown', address: '123 Main St, Downtown', price: 8500000, type: 'APARTMENT' },
      { _id: 'prop_2', title: 'Modern Villa Suburbs', address: '456 Oak Ave, Suburbs', price: 12000000, type: 'VILLA' },
      { _id: 'prop_3', title: 'Premium Condo', address: '789 Business District', price: 6500000, type: 'APARTMENT' },
    ]);

    setCustomers([
      { _id: 'cust_1', name: 'John Smith', email: 'john@example.com', phone: '+1234567890' },
      { _id: 'cust_2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567891' },
      { _id: 'cust_3', name: 'Mike Wilson', email: 'mike@example.com', phone: '+1234567892' },
    ]);

    setSalespeople([
      { _id: 'sales_1', name: 'Alex Thompson', email: 'alex@company.com' },
      { _id: 'sales_2', name: 'Lisa Davis', email: 'lisa@company.com' },
      { _id: 'sales_3', name: 'Robert Brown', email: 'robert@company.com' },
    ]);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePropertyChange = (propertyId) => {
    const property = properties.find(p => p._id === propertyId);
    if (property) {
      setFormData(prev => ({
        ...prev,
        propertyId,
        propertyTitle: property.title,
        propertyAddress: property.address,
        propertyType: property.type,
        propertyPrice: property.price,
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
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
      }));
    }
  };

  const handleSalespersonChange = (salespersonId) => {
    const salesperson = salespeople.find(s => s._id === salespersonId);
    if (salesperson) {
      setFormData(prev => ({
        ...prev,
        assignedSalespersonId: salespersonId,
        salespersonName: salesperson.name,
      }));
    }
  };

  const calculateLoanAmount = () => {
    const total = parseFloat(formData.totalPropertyValue) || 0;
    const down = parseFloat(formData.downPayment) || 0;
    return total - down;
  };

  const calculateEMI = () => {
    const loan = calculateLoanAmount();
    const tenure = parseFloat(formData.loanTenure) || 0;
    const rate = parseFloat(formData.interestRate) || 0;
    
    if (loan > 0 && tenure > 0 && rate > 0) {
      const monthlyRate = rate / (12 * 100);
      const months = tenure * 12;
      const emi = loan * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      return Math.round(emi);
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.propertyId || !formData.customerId || !formData.assignedSalespersonId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Mock success
    toast({
      title: "Success!",
      description: "Purchase booking created successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Navigate back to bookings list
    setTimeout(() => {
      navigate('/purchase-bookings/all');
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      propertyId: '',
      propertyTitle: '',
      propertyAddress: '',
      propertyType: '',
      propertyPrice: '',
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      assignedSalespersonId: '',
      salespersonName: '',
      totalPropertyValue: '',
      downPayment: '',
      loanAmount: '',
      isFinanced: false,
      bankName: '',
      loanTenure: '',
      interestRate: '',
      emiAmount: '',
      paymentTerms: 'INSTALLMENTS',
      installmentCount: '',
      expectedCompletionDate: '',
      notes: '',
    });
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={2}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Create New Purchase Booking
          </Text>
          <Text fontSize="lg" color="gray.600">
            Set up a new property purchase booking with customer and financial details
          </Text>
        </VStack>
        
        <HStack spacing={3}>
          <Button
            leftIcon={<FiX />}
            onClick={() => navigate('/purchase-bookings/all')}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            leftIcon={<FiSave />}
            onClick={handleSubmit}
            colorScheme="blue"
            size="lg"
            px={8}
          >
            Create Booking
          </Button>
        </HStack>
      </Flex>

      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Left Column */}
          <VStack spacing={6} align="stretch">
            {/* Property Selection */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FiHome color="blue.500" />
                  <Heading size="md">Property Details</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Select Property</FormLabel>
                    <Select
                      placeholder="Choose a property"
                      value={formData.propertyId}
                      onChange={(e) => handlePropertyChange(e.target.value)}
                    >
                      {properties.map(property => (
                        <option key={property._id} value={property._id}>
                          {property.title} - ${property.price.toLocaleString()}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Property Title</FormLabel>
                    <Input
                      value={formData.propertyTitle}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Property Address</FormLabel>
                    <Input
                      value={formData.propertyAddress}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Property Type</FormLabel>
                    <Input
                      value={formData.propertyType}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Property Price</FormLabel>
                    <Input
                      value={formData.propertyPrice ? `$${formData.propertyPrice.toLocaleString()}` : ''}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Customer Details */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FiUser color="green.500" />
                  <Heading size="md">Customer Details</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Select Customer</FormLabel>
                    <Select
                      placeholder="Choose a customer"
                      value={formData.customerId}
                      onChange={(e) => handleCustomerChange(e.target.value)}
                    >
                      {customers.map(customer => (
                        <option key={customer._id} value={customer._id}>
                          {customer.name} - {customer.email}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Customer Name</FormLabel>
                    <Input
                      value={formData.customerName}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Customer Email</FormLabel>
                    <Input
                      value={formData.customerEmail}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Customer Phone</FormLabel>
                    <Input
                      value={formData.customerPhone}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Salesperson Assignment */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FiUser color="purple.500" />
                  <Heading size="md">Salesperson Assignment</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <FormControl isRequired>
                  <FormLabel>Assign Salesperson</FormLabel>
                  <Select
                    placeholder="Choose a salesperson"
                    value={formData.assignedSalespersonId}
                    onChange={(e) => handleSalespersonChange(e.target.value)}
                  >
                    {salespeople.map(salesperson => (
                      <option key={salesperson._id} value={salesperson._id}>
                        {salesperson.name} - {salesperson.email}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </CardBody>
            </Card>
          </VStack>

          {/* Right Column */}
          <VStack spacing={6} align="stretch">
            {/* Financial Details */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FiDollarSign color="orange.500" />
                  <Heading size="md">Financial Details</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Total Property Value</FormLabel>
                    <Input
                      value={formData.totalPropertyValue ? `$${formData.totalPropertyValue.toLocaleString()}` : ''}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Down Payment</FormLabel>
                    <NumberInput
                      value={formData.downPayment}
                      onChange={(value) => handleInputChange('downPayment', value)}
                      min={0}
                      max={formData.totalPropertyValue}
                    >
                      <NumberInputField placeholder="Enter down payment amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>
                      Minimum: ${Math.round((formData.totalPropertyValue || 0) * 0.1).toLocaleString()}
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Loan Amount</FormLabel>
                    <Input
                      value={`$${calculateLoanAmount().toLocaleString()}`}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Text>Financed Purchase</Text>
                        <Switch
                          isChecked={formData.isFinanced}
                          onChange={(e) => handleInputChange('isFinanced', e.target.checked)}
                          colorScheme="blue"
                        />
                      </HStack>
                    </FormLabel>
                  </FormControl>

                  {formData.isFinanced && (
                    <VStack spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Bank Name</FormLabel>
                        <Input
                          placeholder="Enter bank name"
                          value={formData.bankName}
                          onChange={(e) => handleInputChange('bankName', e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Loan Tenure (Years)</FormLabel>
                        <NumberInput
                          value={formData.loanTenure}
                          onChange={(value) => handleInputChange('loanTenure', value)}
                          min={1}
                          max={30}
                        >
                          <NumberInputField placeholder="Enter loan tenure" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <NumberInput
                          value={formData.interestRate}
                          onChange={(value) => handleInputChange('interestRate', value)}
                          min={0}
                          max={20}
                          step={0.1}
                        >
                          <NumberInputField placeholder="Enter interest rate" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel>EMI Amount</FormLabel>
                        <Input
                          value={`$${calculateEMI().toLocaleString()}`}
                          isReadOnly
                          bg="gray.50"
                        />
                      </FormControl>
                    </VStack>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Payment Terms */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FiSettings color="teal.500" />
                  <Heading size="md">Payment Terms</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Payment Terms</FormLabel>
                    <Select
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    >
                      <option value="FULL_PAYMENT">Full Payment</option>
                      <option value="INSTALLMENTS">Installments</option>
                      <option value="MILESTONE">Milestone Based</option>
                    </Select>
                  </FormControl>

                  {formData.paymentTerms === 'INSTALLMENTS' && (
                    <FormControl>
                      <FormLabel>Number of Installments</FormLabel>
                      <NumberInput
                        value={formData.installmentCount}
                        onChange={(value) => handleInputChange('installmentCount', value)}
                        min={2}
                        max={60}
                      >
                        <NumberInputField placeholder="Enter number of installments" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Additional Details */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Additional Details</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Expected Completion Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.expectedCompletionDate}
                      onChange={(e) => handleInputChange('expectedCompletionDate', e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      placeholder="Add any additional notes or special requirements"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </SimpleGrid>
      </form>

      {/* Summary Card */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} mt={8}>
        <CardHeader>
          <Heading size="md">Booking Summary</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">Total Value</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                ${(formData.totalPropertyValue || 0).toLocaleString()}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">Down Payment</Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                ${(formData.downPayment || 0).toLocaleString()}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">Loan Amount</Text>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                ${calculateLoanAmount().toLocaleString()}
              </Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CreateNewPurchase; 