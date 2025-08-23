import React from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';

const PurchaseBookingViewer = ({ 
  isOpen, 
  onClose, 
  bookingData,
  onEdit
}) => {
  if (!isOpen || !bookingData) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between">
            <Text>Purchase Booking Details</Text>
            {onEdit && (
              <Button
                leftIcon={<FiEdit />}
                onClick={() => onEdit(bookingData)}
                colorScheme="blue"
                size="sm"
              >
                Edit
              </Button>
            )}
          </HStack>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Header Information */}
            <Box p={4} bg="blue.50" borderRadius="md">
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem>
                  <Text fontSize="sm" color="blue.600" fontWeight="semibold">Booking ID</Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.700">
                    {bookingData.bookingId || bookingData._id?.slice(-8) || 'N/A'}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="blue.600" fontWeight="semibold">Status</Text>
                  <Badge
                    colorScheme={getStatusColor(bookingData.bookingStatus)}
                    variant="solid"
                    fontSize="md"
                    px={3}
                    py={1}
                  >
                    {bookingData.bookingStatus?.replace(/_/g, ' ') || 'N/A'}
                  </Badge>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="blue.600" fontWeight="semibold">Created Date</Text>
                  <Text fontSize="md" fontWeight="semibold">
                    {formatDate(bookingData.createdAt)}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Property & Customer Details */}
            <SimpleGrid columns={2} spacing={4}>
              <Box p={4} bg="green.50" borderRadius="md">
                <Text fontSize="md" fontWeight="semibold" color="green.700" mb={3}>Property Details</Text>
                <VStack spacing={2} align="start">
                  <Text><strong>Name:</strong> {bookingData.propertyId?.name || 'N/A'}</Text>
                  <Text><strong>Price:</strong> {formatCurrency(bookingData.propertyId?.price)}</Text>
                  <Text><strong>Description:</strong> {bookingData.propertyId?.description || 'No description'}</Text>
                </VStack>
              </Box>

              <Box p={4} bg="purple.50" borderRadius="md">
                <Text fontSize="md" fontWeight="semibold" color="purple.700" mb={3}>Customer Details</Text>
                <VStack spacing={2} align="start">
                  <Text><strong>Name:</strong> {bookingData.customerId ? `${bookingData.customerId.firstName || ''} ${bookingData.customerId.lastName || ''}`.trim() : 'N/A'}</Text>
                  <Text><strong>Email:</strong> {bookingData.customerId?.email || 'N/A'}</Text>
                  <Text><strong>Phone:</strong> {bookingData.customerId?.phoneNumber || 'N/A'}</Text>
                </VStack>
              </Box>
            </SimpleGrid>

            {/* Financial Details */}
            <Box p={4} bg="teal.50" borderRadius="md">
              <Text fontSize="md" fontWeight="semibold" color="teal.700" mb={3}>Financial Details</Text>
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem>
                  <Text fontSize="sm" color="teal.600" fontWeight="semibold">Total Property Value</Text>
                  <Text fontSize="lg" fontWeight="bold" color="teal.700">
                    {formatCurrency(bookingData.totalPropertyValue)}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="teal.600" fontWeight="semibold">Down Payment</Text>
                  <Text fontSize="lg" fontWeight="bold" color="teal.700">
                    {formatCurrency(bookingData.downPayment)}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="teal.600" fontWeight="semibold">Loan Amount</Text>
                  <Text fontSize="lg" fontWeight="bold" color="teal.700">
                    {formatCurrency(bookingData.loanAmount)}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Payment Terms */}
            <Box p={4} bg="indigo.50" borderRadius="md">
              <Text fontSize="md" fontWeight="semibold" color="indigo.700" mb={3}>Payment Terms</Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <Text fontSize="sm" color="indigo.600" fontWeight="semibold">Payment Terms</Text>
                  <Badge colorScheme="indigo" variant="solid" fontSize="md" px={3} py={1}>
                    {bookingData.paymentTerms || 'N/A'}
                  </Badge>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="indigo.600" fontWeight="semibold">Number of Installments</Text>
                  <Text fontSize="md" fontWeight="semibold">
                    {bookingData.installmentCount || '0'}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Financing Details */}
            {bookingData.isFinanced && (
              <Box p={4} bg="pink.50" borderRadius="md">
                <Text fontSize="md" fontWeight="semibold" color="pink.700" mb={3}>Financing Details</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <Text fontSize="sm" color="pink.600" fontWeight="semibold">Bank Name</Text>
                    <Text fontSize="md">{bookingData.bankName || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="pink.600" fontWeight="semibold">Loan Tenure</Text>
                    <Text fontSize="md">{bookingData.loanTenure ? `${bookingData.loanTenure} months` : 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="pink.600" fontWeight="semibold">Interest Rate</Text>
                    <Text fontSize="md">{bookingData.interestRate ? `${bookingData.interestRate}%` : 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="pink.600" fontWeight="semibold">EMI Amount</Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatCurrency(bookingData.emiAmount)}
                    </Text>
                  </GridItem>
                </Grid>
              </Box>
            )}

            {/* Installment Schedule */}
            {bookingData.installmentSchedule && bookingData.installmentSchedule.length > 0 && (
              <Box p={4} bg="yellow.50" borderRadius="md">
                <Text fontSize="md" fontWeight="semibold" color="yellow.700" mb={3}>Installment Schedule</Text>
                <Box maxH="40" overflowY="auto">
                  <SimpleGrid columns={3} spacing={3}>
                    {bookingData.installmentSchedule.slice(0, 6).map((installment, index) => (
                      <Box key={installment._id || index} p={3} bg="white" borderRadius="md" border="1px" borderColor="yellow.200">
                        <VStack spacing={1} align="start">
                          <Text fontSize="xs" color="gray.500">Installment {installment.installmentNumber}</Text>
                          <Text fontSize="sm" fontWeight="semibold">
                            {formatCurrency(installment.amount)}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Due: {formatDate(installment.dueDate)}
                          </Text>
                          <Badge
                            colorScheme={
                              installment.status === 'PAID' ? 'green' :
                              installment.status === 'PENDING' ? 'yellow' :
                              installment.status === 'OVERDUE' ? 'red' : 'gray'
                            }
                            variant="solid"
                            fontSize="xs"
                          >
                            {installment.status}
                          </Badge>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                  {bookingData.installmentSchedule.length > 6 && (
                    <Text fontSize="sm" color="gray.500" mt={3} textAlign="center">
                      +{bookingData.installmentSchedule.length - 6} more installments
                    </Text>
                  )}
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseBookingViewer; 