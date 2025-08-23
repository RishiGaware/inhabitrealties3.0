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
  useToast,
  useColorModeValue,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { FiSave, FiX, FiPlus, FiHome, FiUser, FiDollarSign, FiCalendar } from 'react-icons/fi';

const CreateNewRental = () => {
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
    
    // Customer Details
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // Salesperson Details
    assignedSalespersonId: '',
    salespersonName: '',
    
    // Rental Details
    monthlyRent: '',
    securityDeposit: '',
    leaseStart: '',
    leaseEnd: '',
    leaseDuration: '',
    
    // Additional Details
    utilitiesIncluded: false,
    parkingIncluded: false,
    petFriendly: false,
    notes: '',
  });

  // Mock data for dropdowns
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salespeople, setSalespeople] = useState([]);

  useEffect(() => {
    // Mock data
    setProperties([
      { _id: 'prop_1', title: 'Modern Studio Apartment', address: '123 Main St, Downtown', type: 'APARTMENT' },
      { _id: 'prop_2', title: 'Downtown Loft', address: '456 Oak Ave, Downtown', type: 'LOFT' },
      { _id: 'prop_3', title: 'Suburban House', address: '789 Pine St, Suburbs', type: 'HOUSE' },
      { _id: 'prop_4', title: 'Luxury Penthouse', address: '321 Elite Blvd, Uptown', type: 'PENTHOUSE' },
    ]);

    setCustomers([
      { _id: 'cust_1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567890' },
      { _id: 'cust_2', name: 'Bob Smith', email: 'bob@example.com', phone: '+1234567891' },
      { _id: 'cust_3', name: 'Carol Brown', email: 'carol@example.com', phone: '+1234567892' },
    ]);

    setSalespeople([
      { _id: 'sales_1', name: 'Sarah Wilson', email: 'sarah@company.com' },
      { _id: 'sales_2', name: 'Mike Davis', email: 'mike@company.com' },
      { _id: 'sales_3', name: 'Lisa Johnson', email: 'lisa@company.com' },
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

  const calculateLeaseDuration = () => {
    if (formData.leaseStart && formData.leaseEnd) {
      const start = new Date(formData.leaseStart);
      const end = new Date(formData.leaseEnd);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      return `${months} months, ${days} days`;
    }
    return '';
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
      description: "Rental booking created successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Navigate back to rentals list
    setTimeout(() => {
      navigate('/rental-bookings/all');
    }, 1500);
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={2}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Create New Rental Booking
          </Text>
          <Text fontSize="lg" color="gray.600">
            Set up a new property rental booking with customer and lease details
          </Text>
        </VStack>
        
        <HStack spacing={3}>
          <Button
            leftIcon={<FiX />}
            onClick={() => navigate('/rental-bookings/all')}
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
            Create Rental
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
                          {property.title} - {property.type}
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
                  <FormControl isRequired>
                    <FormLabel>Monthly Rent</FormLabel>
                    <NumberInput
                      value={formData.monthlyRent}
                      onChange={(value) => handleInputChange('monthlyRent', value)}
                      min={0}
                    >
                      <NumberInputField placeholder="Enter monthly rent amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Security Deposit</FormLabel>
                    <NumberInput
                      value={formData.securityDeposit}
                      onChange={(value) => handleInputChange('securityDeposit', value)}
                      min={0}
                    >
                      <NumberInputField placeholder="Enter security deposit amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>
                      Typically 1-2 months of rent
                    </FormHelperText>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Lease Terms */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FiCalendar color="teal.500" />
                  <Heading size="md">Lease Terms</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Lease Start Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.leaseStart}
                      onChange={(e) => handleInputChange('leaseStart', e.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Lease End Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.leaseEnd}
                      onChange={(e) => handleInputChange('leaseEnd', e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Lease Duration</FormLabel>
                    <Input
                      value={calculateLeaseDuration()}
                      isReadOnly
                      bg="gray.50"
                      placeholder="Will be calculated automatically"
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Additional Features */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Additional Features</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Text>Utilities Included</Text>
                        <Switch
                          isChecked={formData.utilitiesIncluded}
                          onChange={(e) => handleInputChange('utilitiesIncluded', e.target.checked)}
                          colorScheme="blue"
                        />
                      </HStack>
                    </FormLabel>
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Text>Parking Included</Text>
                        <Switch
                          isChecked={formData.parkingIncluded}
                          onChange={(e) => handleInputChange('parkingIncluded', e.target.checked)}
                          colorScheme="blue"
                        />
                      </HStack>
                    </FormLabel>
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Text>Pet Friendly</Text>
                        <Switch
                          isChecked={formData.petFriendly}
                          onChange={(e) => handleInputChange('petFriendly', e.target.checked)}
                          colorScheme="blue"
                        />
                      </HStack>
                    </FormLabel>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Additional Details */}
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Additional Details</Heading>
              </CardHeader>
              <CardBody>
                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    placeholder="Add any additional notes or special requirements"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                  />
                </FormControl>
              </CardBody>
            </Card>
          </VStack>
        </SimpleGrid>
      </form>

      {/* Summary Card */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} mt={8}>
        <CardHeader>
          <Heading size="md">Rental Summary</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">Monthly Rent</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {formData.monthlyRent ? formatCurrency(formData.monthlyRent) : '$0'}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">Security Deposit</Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {formData.securityDeposit ? formatCurrency(formData.securityDeposit) : '$0'}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">Lease Duration</Text>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {calculateLeaseDuration() || 'Not set'}
              </Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CreateNewRental; 