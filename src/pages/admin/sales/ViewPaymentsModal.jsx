import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  Badge,
  Box,
  Divider,
  useToast,
} from "@chakra-ui/react";

// Dummy payment history data
const dummyPaymentHistory = [
  {
    _id: "1",
    type: "BOOKING",
    amount: 500000,
    date: "2024-01-15",
    paymentMode: "BANK_TRANSFER",
    reference: "BK001",
    status: "COMPLETED",
    description: "Booking amount paid",
  },
  {
    _id: "2",
    type: "INSTALLMENT",
    amount: 500000,
    date: "2024-02-15",
    paymentMode: "UPI",
    reference: "INS001",
    status: "COMPLETED",
    description: "1st installment",
  },
  {
    _id: "3",
    type: "INSTALLMENT",
    amount: 500000,
    date: "2024-03-15",
    paymentMode: "CASH",
    reference: "INS002",
    status: "COMPLETED",
    description: "2nd installment",
  },
  {
    _id: "4",
    type: "INSTALLMENT",
    amount: 500000,
    date: "2024-04-15",
    paymentMode: "BANK_TRANSFER",
    reference: "INS003",
    status: "PENDING",
    description: "3rd installment",
  },
  {
    _id: "5",
    type: "INSTALLMENT",
    amount: 500000,
    date: "2024-05-15",
    paymentMode: "UPI",
    reference: "INS004",
    status: "PENDING",
    description: "4th installment",
  },
];

const ViewPaymentsModal = ({ isOpen, onClose, sale }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && sale) {
      loadPaymentHistory();
    }
  }, [isOpen, sale]);

  const loadPaymentHistory = () => {
    setLoading(true);
    try {
      // Using dummy data
      setPaymentHistory(dummyPaymentHistory);
    } catch (error) {
      toast({
        title: "Error loading payment history",
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPaymentModeLabel = (mode) => {
    const modeLabels = {
      CASH: "Cash",
      UPI: "UPI",
      BANK_TRANSFER: "Bank Transfer",
      CHEQUE: "Cheque",
      CARD: "Card",
    };
    return modeLabels[mode] || mode;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      COMPLETED: { color: "green", text: "Completed" },
      PENDING: { color: "yellow", text: "Pending" },
      FAILED: { color: "red", text: "Failed" },
      CANCELLED: { color: "red", text: "Cancelled" },
    };
    
    const config = statusConfig[status] || { color: "gray", text: status };
    
    return (
      <Badge colorScheme={config.color} variant="subtle" px={2} py={1} borderRadius="full">
        {config.text}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      BOOKING: { color: "blue", text: "Booking" },
      INSTALLMENT: { color: "purple", text: "Installment" },
      RENT: { color: "orange", text: "Rent" },
    };
    
    const config = typeConfig[type] || { color: "gray", text: type };
    
    return (
      <Badge colorScheme={config.color} variant="subtle" px={2} py={1} borderRadius="full">
        {config.text}
      </Badge>
    );
  };

  // Calculate totals
  const totalPaid = paymentHistory
    .filter(payment => payment.status === 'COMPLETED')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalPending = paymentHistory
    .filter(payment => payment.status === 'PENDING')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              Payment History - {sale?.propertyName}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Buyer: {sale?.buyerName}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* Summary Cards */}
          <HStack spacing={6} mb={6}>
            <Box
              bg="green.50"
              p={4}
              borderRadius="lg"
              border="1px"
              borderColor="green.200"
              flex={1}
            >
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="green.600" fontWeight="medium">
                  Total Paid
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="green.700">
                  {formatCurrency(totalPaid)}
                </Text>
                <Text fontSize="xs" color="green.600">
                  {paymentHistory.filter(p => p.status === 'COMPLETED').length} payments
                </Text>
              </VStack>
            </Box>

            <Box
              bg="yellow.50"
              p={4}
              borderRadius="lg"
              border="1px"
              borderColor="yellow.200"
              flex={1}
            >
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="yellow.600" fontWeight="medium">
                  Pending Amount
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="yellow.700">
                  {formatCurrency(totalPending)}
                </Text>
                <Text fontSize="xs" color="yellow.600">
                  {paymentHistory.filter(p => p.status === 'PENDING').length} payments
                </Text>
              </VStack>
            </Box>

            <Box
              bg="blue.50"
              p={4}
              borderRadius="lg"
              border="1px"
              borderColor="blue.200"
              flex={1}
            >
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="blue.600" fontWeight="medium">
                  Total Property Value
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.700">
                  {formatCurrency(sale?.totalPrice || 0)}
                </Text>
                <Text fontSize="xs" color="blue.600">
                  {sale?.remainingAmount ? `${formatCurrency(sale.remainingAmount)} remaining` : 'Fully paid'}
                </Text>
              </VStack>
            </Box>
          </HStack>

          <Divider mb={6} />

          {/* Payment History Table */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Payment Details
            </Text>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Amount</Th>
                    <Th>Payment Mode</Th>
                    <Th>Reference</Th>
                    <Th>Status</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paymentHistory.map((payment) => (
                    <Tr key={payment._id}>
                      <Td>{formatDate(payment.date)}</Td>
                      <Td>{getTypeBadge(payment.type)}</Td>
                      <Td>
                        <Text fontWeight="medium">
                          {formatCurrency(payment.amount)}
                        </Text>
                      </Td>
                      <Td>{getPaymentModeLabel(payment.paymentMode)}</Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {payment.reference}
                        </Text>
                      </Td>
                      <Td>{getStatusBadge(payment.status)}</Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {payment.description}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>

          {/* Payment Summary */}
          <Box mt={6} p={4} bg="gray.50" borderRadius="lg">
            <Text fontSize="md" fontWeight="semibold" mb={3}>
              Payment Summary
            </Text>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text>Total Property Value:</Text>
                <Text fontWeight="semibold">{formatCurrency(sale?.totalPrice || 0)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Total Paid:</Text>
                <Text fontWeight="semibold" color="green.600">{formatCurrency(totalPaid)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Pending Amount:</Text>
                <Text fontWeight="semibold" color="yellow.600">{formatCurrency(totalPending)}</Text>
              </HStack>
              <Divider />
              <HStack justify="space-between">
                <Text fontWeight="semibold">Remaining Balance:</Text>
                <Text fontWeight="bold" color="red.600">
                  {formatCurrency((sale?.totalPrice || 0) - totalPaid)}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewPaymentsModal; 