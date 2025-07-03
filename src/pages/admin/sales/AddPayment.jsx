import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@chakra-ui/react";

// Dummy data for properties and buyers
const dummyProperties = [
  { _id: "prop1", name: "Sunset Villa", price: 2500000 },
  { _id: "prop2", name: "Ocean View Apartment", price: 1800000 },
  { _id: "prop3", name: "Garden Heights", price: 3200000 },
  { _id: "prop4", name: "City Center Plaza", price: 4200000 },
  { _id: "prop5", name: "Luxury Penthouse", price: 5500000 },
];

const dummyBuyers = [
  { _id: "buyer1", name: "John Doe", email: "john.doe@example.com" },
  { _id: "buyer2", name: "Jane Smith", email: "jane.smith@example.com" },
  { _id: "buyer3", name: "Mike Johnson", email: "mike.johnson@example.com" },
  { _id: "buyer4", name: "Sarah Wilson", email: "sarah.wilson@example.com" },
  { _id: "buyer5", name: "David Brown", email: "david.brown@example.com" },
];

const AddPayment = () => {
  const [formData, setFormData] = useState({
    propertyId: "",
    buyerId: "",
    amount: "",
    paymentDate: "",
    paymentMode: "",
    description: "",
    reference: "",
  });
  const [properties, setProperties] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadProperties();
    loadBuyers();
  }, []);

  const loadProperties = () => {
    try {
      // Using dummy data
      setProperties(dummyProperties);
    } catch (error) {
      toast({
        title: "Error loading properties",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const loadBuyers = () => {
    try {
      // Using dummy data
      setBuyers(dummyBuyers);
    } catch (error) {
      toast({
        title: "Error loading buyers",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Update selected property/buyer when changed
    if (name === 'propertyId') {
      const property = properties.find(p => p._id === value);
      setSelectedProperty(property);
    } else if (name === 'buyerId') {
      const buyer = buyers.find(b => b._id === value);
      setSelectedBuyer(buyer);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.propertyId || !formData.buyerId || !formData.amount || !formData.paymentDate || !formData.paymentMode) {
        throw new Error("Please fill in all required fields");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Payment added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        propertyId: "",
        buyerId: "",
        amount: "",
        paymentDate: "",
        paymentMode: "",
        description: "",
        reference: "",
      });
      setSelectedProperty(null);
      setSelectedBuyer(null);

    } catch (error) {
      toast({
        title: "Error adding payment",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" color="light.darkText" mb={6}>
        Add Payment
      </Text>

      <Card maxW="800px" mx="auto">
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Payment Details
          </Text>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Property and Buyer Selection */}
              <HStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Property</FormLabel>
                  <Select
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleInputChange}
                    placeholder="Select Property"
                  >
                    {properties.map((property) => (
                      <option key={property._id} value={property._id}>
                        {property.name} - {formatCurrency(property.price)}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Buyer</FormLabel>
                  <Select
                    name="buyerId"
                    value={formData.buyerId}
                    onChange={handleInputChange}
                    placeholder="Select Buyer"
                  >
                    {buyers.map((buyer) => (
                      <option key={buyer._id} value={buyer._id}>
                        {buyer.name} ({buyer.email})
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              {/* Selected Property and Buyer Info */}
              {(selectedProperty || selectedBuyer) && (
                <Box p={4} bg="gray.50" borderRadius="md">
                  <VStack spacing={2} align="start">
                    {selectedProperty && (
                      <Text fontSize="sm">
                        <strong>Property:</strong> {selectedProperty.name} - {formatCurrency(selectedProperty.price)}
                      </Text>
                    )}
                    {selectedBuyer && (
                      <Text fontSize="sm">
                        <strong>Buyer:</strong> {selectedBuyer.name} ({selectedBuyer.email})
                      </Text>
                    )}
                  </VStack>
                </Box>
              )}

              <Divider />

              {/* Payment Details */}
              <HStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Payment Amount</FormLabel>
                  <Input
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Payment Date</FormLabel>
                  <Input
                    name="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Payment Mode</FormLabel>
                  <Select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    placeholder="Select payment mode"
                  >
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="online">Online Payment</option>
                    <option value="upi">UPI</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Reference Number</FormLabel>
                  <Input
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="Cheque/Transaction reference"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Payment description (optional)"
                />
              </FormControl>

              {/* Submit Button */}
              <HStack justify="flex-end" spacing={4}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      propertyId: "",
                      buyerId: "",
                      amount: "",
                      paymentDate: "",
                      paymentMode: "",
                      description: "",
                      reference: "",
                    });
                    setSelectedProperty(null);
                    setSelectedBuyer(null);
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  colorScheme="brand"
                  isLoading={loading}
                  loadingText="Adding Payment"
                >
                  Add Payment
                </Button>
              </HStack>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
};

export default AddPayment; 