import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Tooltip,
  IconButton,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FiEye, FiEdit, FiDollarSign, FiCalendar, FiClock, FiAlertTriangle, FiCheckCircle, FiPlus } from 'react-icons/fi';

const PendingInstallments = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const { isOpen: isPaymentModalOpen, onOpen: onPaymentModalOpen, onClose: onPaymentModalClose } = useDisclosure();
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMode: 'BANK_TRANSFER',
    notes: '',
  });

  // Mock data for pending installments
  const [pendingInstallments, setPendingInstallments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    overdue: 0,
    dueThisWeek: 0,
    dueThisMonth: 0,
  });

  useEffect(() => {
    // Mock data for pending installments
    const mockInstallments = [
      {
        _id: 'inst_1',
        bookingId: 'PURCHASE-2024-001',
        customerName: 'John Smith',
        propertyTitle: 'Luxury Apartment Downtown',
        installmentNumber: 3,
        dueDate: '2024-02-15',
        amount: 45000,
        status: 'PENDING',
        daysOverdue: 0,
        lateFees: 0,
        salespersonName: 'Alex Thompson',
        customerPhone: '+1234567890',
        customerEmail: 'john@example.com',
      },
      {
        _id: 'inst_2',
        bookingId: 'PURCHASE-2024-002',
        customerName: 'Sarah Johnson',
        propertyTitle: 'Modern Villa Suburbs',
        installmentNumber: 2,
        dueDate: '2024-02-10',
        amount: 52000,
        status: 'OVERDUE',
        daysOverdue: 5,
        lateFees: 2600,
        salespersonName: 'Lisa Davis',
        customerPhone: '+1234567891',
        customerEmail: 'sarah@example.com',
      },
      {
        _id: 'inst_3',
        bookingId: 'PURCHASE-2024-003',
        customerName: 'Mike Wilson',
        propertyTitle: 'Premium Condo',
        installmentNumber: 5,
        dueDate: '2024-02-20',
        amount: 28000,
        status: 'PENDING',
        daysOverdue: 0,
        lateFees: 0,
        salespersonName: 'Robert Brown',
        customerPhone: '+1234567892',
        customerEmail: 'mike@example.com',
      },
      {
        _id: 'inst_4',
        bookingId: 'PURCHASE-2024-004',
        customerName: 'Emily Davis',
        propertyTitle: 'Executive Penthouse',
        installmentNumber: 1,
        dueDate: '2024-02-05',
        amount: 75000,
        status: 'OVERDUE',
        daysOverdue: 10,
        lateFees: 7500,
        salespersonName: 'Alex Thompson',
        customerPhone: '+1234567893',
        customerEmail: 'emily@example.com',
      },
      {
        _id: 'inst_5',
        bookingId: 'PURCHASE-2024-005',
        customerName: 'David Brown',
        propertyTitle: 'Garden Villa',
        installmentNumber: 4,
        dueDate: '2024-02-25',
        amount: 38000,
        status: 'PENDING',
        daysOverdue: 0,
        lateFees: 0,
        salespersonName: 'Lisa Davis',
        customerPhone: '+1234567894',
        customerEmail: 'david@example.com',
      },
    ];

    setPendingInstallments(mockInstallments);
    
    // Calculate stats
    const total = mockInstallments.length;
    const totalAmount = mockInstallments.reduce((sum, inst) => sum + inst.amount, 0);
    const overdue = mockInstallments.filter(inst => inst.status === 'OVERDUE').length;
    const dueThisWeek = mockInstallments.filter(inst => {
      const dueDate = new Date(inst.dueDate);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;
    const dueThisMonth = mockInstallments.filter(inst => {
      const dueDate = new Date(inst.dueDate);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    }).length;

    setStats({ total, totalAmount, overdue, dueThisWeek, dueThisMonth });
  }, []);

  const getStatusColor = (status, daysOverdue) => {
    if (status === 'OVERDUE') return 'red';
    if (daysOverdue <= 7) return 'orange';
    return 'yellow';
  };

  const getStatusText = (status, daysOverdue) => {
    if (status === 'OVERDUE') return `OVERDUE (${daysOverdue} days)`;
    if (daysOverdue <= 7) return 'DUE SOON';
    return 'PENDING';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRecordPayment = (installment) => {
    setSelectedInstallment(installment);
    setPaymentForm({
      amount: installment.amount.toString(),
      paymentMode: 'BANK_TRANSFER',
      notes: '',
    });
    onPaymentModalOpen();
  };

  const handlePaymentSubmit = () => {
    // Mock payment recording
    const updatedInstallments = pendingInstallments.map(inst => 
      inst._id === selectedInstallment._id 
        ? { ...inst, status: 'PAID', paidDate: new Date().toISOString() }
        : inst
    );
    
    setPendingInstallments(updatedInstallments);
    onPaymentModalClose();
    
    // Show success message
    // You can add toast notification here
  };

  const handleContactCustomer = (installment) => {
    // Mock contact action - could open email client or phone dialer
    console.log(`Contacting ${installment.customerName} for installment ${installment.installmentNumber}`);
  };

  const handleSendReminder = (installment) => {
    // Mock reminder action
    console.log(`Sending reminder to ${installment.customerName} for installment ${installment.installmentNumber}`);
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={2}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Pending Installments
          </Text>
          <Text fontSize="lg" color="gray.600">
            Track and manage pending installment payments across all purchase bookings
          </Text>
        </VStack>
        
        <Button
          leftIcon={<FiPlus />}
          onClick={() => navigate('/purchase-bookings/all')}
          colorScheme="blue"
          size="lg"
        >
          View All Bookings
        </Button>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6} mb={8}>
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Pending</StatLabel>
              <StatNumber fontSize="3xl" color="blue.600">{stats.total}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Amount</StatLabel>
              <StatNumber fontSize="2xl" color="green.600">
                {formatCurrency(stats.totalAmount)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Overdue</StatLabel>
              <StatNumber fontSize="3xl" color="red.600">{stats.overdue}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                15% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Due This Week</StatLabel>
              <StatNumber fontSize="3xl" color="orange.600">{stats.dueThisWeek}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                3% from last week
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Due This Month</StatLabel>
              <StatNumber fontSize="3xl" color="purple.600">{stats.dueThisMonth}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                7% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Overdue Alert */}
      {stats.overdue > 0 && (
        <Alert status="error" mb={6} borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Overdue Installments!</AlertTitle>
            <AlertDescription>
              You have {stats.overdue} overdue installment(s) totaling {formatCurrency(
                pendingInstallments
                  .filter(inst => inst.status === 'OVERDUE')
                  .reduce((sum, inst) => sum + inst.amount + inst.lateFees, 0)
              )}. Please follow up with customers immediately.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Installments Table */}
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Booking ID</Th>
                  <Th>Customer</Th>
                  <Th>Property</Th>
                  <Th>Installment</Th>
                  <Th>Due Date</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Salesperson</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pendingInstallments.map((installment) => (
                  <Tr key={installment._id}>
                    <Td>
                      <Text fontWeight="semibold" color="blue.600">
                        {installment.bookingId}
                      </Text>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{installment.customerName}</Text>
                        <Text fontSize="sm" color="gray.600">{installment.customerEmail}</Text>
                        <Text fontSize="sm" color="gray.600">{installment.customerPhone}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{installment.propertyTitle}</Text>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue" variant="subtle">
                        #{installment.installmentNumber}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm">{formatDate(installment.dueDate)}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {getDaysUntil(installment.dueDate) < 0 
                            ? `${Math.abs(getDaysUntil(installment.dueDate))} days ago`
                            : `${getDaysUntil(installment.dueDate)} days left`
                          }
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" color="green.600">
                          {formatCurrency(installment.amount)}
                        </Text>
                        {installment.lateFees > 0 && (
                          <Text fontSize="xs" color="red.600">
                            +{formatCurrency(installment.lateFees)} late fees
                          </Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={getStatusColor(installment.status, installment.daysOverdue)} 
                        variant="subtle"
                      >
                        {getStatusText(installment.status, installment.daysOverdue)}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{installment.salespersonName}</Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label="Record Payment">
                          <IconButton
                            icon={<FiCheckCircle />}
                            onClick={() => handleRecordPayment(installment)}
                            variant="ghost"
                            colorScheme="green"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="Contact Customer">
                          <IconButton
                            icon={<FiEdit />}
                            onClick={() => handleContactCustomer(installment)}
                            variant="ghost"
                            colorScheme="blue"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="Send Reminder">
                          <IconButton
                            icon={<FiClock />}
                            onClick={() => handleSendReminder(installment)}
                            variant="ghost"
                            colorScheme="orange"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="View Details">
                          <IconButton
                            icon={<FiEye />}
                            onClick={() => navigate(`/purchase-bookings/${installment.bookingId}`)}
                            variant="ghost"
                            colorScheme="purple"
                            size="sm"
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>

      {/* Payment Recording Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={onPaymentModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Installment Payment</ModalHeader>
          <ModalBody>
            {selectedInstallment && (
              <VStack spacing={4} align="stretch">
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.600">Customer</Text>
                  <Text fontWeight="semibold">{selectedInstallment.customerName}</Text>
                  <Text fontSize="sm" color="gray.600">Property: {selectedInstallment.propertyTitle}</Text>
                  <Text fontSize="sm" color="gray.600">Installment #{selectedInstallment.installmentNumber}</Text>
                </Box>

                <FormControl>
                  <FormLabel>Payment Amount</FormLabel>
                  <NumberInput
                    value={paymentForm.amount}
                    onChange={(value) => setPaymentForm(prev => ({ ...prev, amount: value }))}
                    min={0}
                    max={selectedInstallment.amount + selectedInstallment.lateFees}
                  >
                    <NumberInputField placeholder="Enter payment amount" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="sm" color="gray.600">
                    Due: {formatCurrency(selectedInstallment.amount)}
                    {selectedInstallment.lateFees > 0 && ` + Late Fees: ${formatCurrency(selectedInstallment.lateFees)}`}
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Payment Mode</FormLabel>
                  <Select
                    value={paymentForm.paymentMode}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMode: e.target.value }))}
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="ONLINE">Online Payment</option>
                    <option value="CARD">Card Payment</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    placeholder="Add any payment notes or reference numbers"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onPaymentModalClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handlePaymentSubmit}>
                Record Payment
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PendingInstallments; 