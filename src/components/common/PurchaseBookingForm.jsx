import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Badge,
  useToast,
  Text,
} from '@chakra-ui/react';
import { FiSave, FiX } from 'react-icons/fi';

const PurchaseBookingForm = ({ 
  isOpen, 
  onClose, 
  mode = 'add', // 'add' or 'edit'
  initialData = null,
  onSubmit,
  isLoading = false 
}) => {
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
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
    bookingStatus: 'PENDING'
  });

  useEffect(() => {
    // If editing, populate form with initial data
    if (mode === 'edit' && initialData) {
      setFormData({
        totalPropertyValue: initialData.totalPropertyValue?.toString() || '',
        downPayment: initialData.downPayment?.toString() || '',
        loanAmount: initialData.loanAmount?.toString() || '',
        isFinanced: initialData.isFinanced || false,
        bankName: initialData.bankName || '',
        loanTenure: initialData.loanTenure?.toString() || '',
        interestRate: initialData.interestRate?.toString() || '',
        emiAmount: initialData.emiAmount?.toString() || '',
        paymentTerms: initialData.paymentTerms || 'INSTALLMENTS',
        installmentCount: initialData.installmentCount?.toString() || '',
        bookingStatus: initialData.bookingStatus || 'PENDING'
      });
    }
  }, [mode, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const calculateLoanAmount = () => {
    const totalValue = parseFloat(formData.totalPropertyValue) || 0;
    const downPayment = parseFloat(formData.downPayment) || 0;
    return Math.max(0, totalValue - downPayment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.totalPropertyValue || !formData.downPayment) {
      toast({
        title: "Validation Error",
        description: "Total Property Value and Down Payment are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Prepare submission data
      const submissionData = {
        totalPropertyValue: parseFloat(formData.totalPropertyValue),
        downPayment: parseFloat(formData.downPayment),
        loanAmount: parseFloat(formData.loanAmount),
        isFinanced: formData.isFinanced,
        paymentTerms: formData.paymentTerms,
        installmentCount: parseInt(formData.installmentCount),
        bookingStatus: formData.bookingStatus
      };

      // Add financing details if applicable
      if (formData.isFinanced) {
        submissionData.bankName = formData.bankName;
        submissionData.loanTenure = parseInt(formData.loanTenure);
        submissionData.interestRate = parseFloat(formData.interestRate);
        submissionData.emiAmount = parseFloat(formData.emiAmount);
      }

      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
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
      bookingStatus: 'PENDING'
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === 'add' ? 'Create New Purchase Booking' : 'Edit Purchase Booking'}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {/* Basic Information */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Total Property Value</FormLabel>
                  <NumberInput
                    value={formData.totalPropertyValue}
                    onChange={(value) => handleNumberChange('totalPropertyValue', value)}
                    min={0}
                  >
                    <NumberInputField placeholder="Enter total value" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Down Payment</FormLabel>
                  <NumberInput
                    value={formData.downPayment}
                    onChange={(value) => handleNumberChange('downPayment', value)}
                    min={0}
                    max={parseFloat(formData.totalPropertyValue) || 999999999}
                  >
                    <NumberInputField placeholder="Enter down payment" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              {/* Calculated Loan Amount */}
              <Box p={3} bg="blue.50" borderRadius="md">
                <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                  Calculated Loan Amount: ₹{calculateLoanAmount().toLocaleString()}
                </Text>
              </Box>

              {/* Payment Terms */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Payment Terms</FormLabel>
                  <Select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                  >
                    <option value="INSTALLMENTS">Installments</option>
                    <option value="FULL_PAYMENT">Full Payment</option>
                    <option value="PARTIAL_PAYMENT">Partial Payment</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Number of Installments</FormLabel>
                  <NumberInput
                    value={formData.installmentCount}
                    onChange={(value) => handleNumberChange('installmentCount', value)}
                    min={1}
                    max={120}
                  >
                    <NumberInputField placeholder="Enter number of installments" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              {/* Financing Details */}
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="isFinanced" mb="0">
                  Is Financed?
                </FormLabel>
                <Switch
                  id="isFinanced"
                  isChecked={formData.isFinanced}
                  onChange={(e) => handleSwitchChange('isFinanced', e.target.checked)}
                  colorScheme="blue"
                />
              </FormControl>

              {formData.isFinanced && (
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Bank Name</FormLabel>
                    <Input
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter bank name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Loan Tenure (months)</FormLabel>
                    <NumberInput
                      value={formData.loanTenure}
                      onChange={(value) => handleNumberChange('loanTenure', value)}
                      min={1}
                      max={360}
                    >
                      <NumberInputField placeholder="Enter tenure in months" />
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
                      onChange={(value) => handleNumberChange('interestRate', value)}
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
                    <NumberInput
                      value={formData.emiAmount}
                      onChange={(value) => handleNumberChange('emiAmount', value)}
                      min={0}
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

              {/* Booking Status */}
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="bookingStatus"
                  value={formData.bookingStatus}
                  onChange={handleInputChange}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </Select>
              </FormControl>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              leftIcon={<FiSave />}
              onClick={handleSubmit}
              colorScheme="blue"
              isLoading={isLoading}
              loadingText={mode === 'add' ? 'Creating...' : 'Updating...'}
            >
              {mode === 'add' ? 'Create Booking' : 'Update Booking'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseBookingForm; 