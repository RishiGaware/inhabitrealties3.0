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
import { FiEye, FiEdit, FiDollarSign, FiCalendar, FiClock, FiCheckCircle, FiPlus, FiPhone, FiMail } from 'react-icons/fi';

const PendingRents = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const { isOpen: isPaymentModalOpen, onOpen: onPaymentModalOpen, onClose: onPaymentModalClose } = useDisclosure();
  const { isOpen: isContactModalOpen, onOpen: onContactModalOpen, onClose: onContactModalClose } = useDisclosure();
  const [selectedRent, setSelectedRent] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMode: 'BANK_TRANSFER',
    notes: '',
  });
  const [contactForm, setContactForm] = useState({
    contactType: 'PHONE',
    message: '',
    followUpDate: '',
  });

  // Mock data for pending rents
  const [pendingRents, setPendingRents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    overdue: 0,
    dueThisWeek: 0,
    dueThisMonth: 0,
  });

  useEffect(() => {
    // Mock data for pending rents
    const mockRents = [
      {
        _id: 'rent_1',
        rentalId: 'RENTAL-2024-001',
        customerName: 'Alice Johnson',
        propertyTitle: 'Modern Studio Apartment',
        monthlyRent: 2500,
        dueDate: '2024-02-01',
        status: 'OVERDUE',
        daysOverdue: 15,
        lateFees: 1250,
        priority: 'HIGH',
        salespersonName: 'Sarah Wilson',
        customerPhone: '+1234567890',
        customerEmail: 'alice@example.com',
        lastContact: '2024-01-25',
        contactAttempts: 3,
        notes: 'Customer experiencing temporary financial difficulties',
      },
      {
        _id: 'rent_2',
        rentalId: 'RENTAL-2024-002',
        customerName: 'Bob Smith',
        propertyTitle: 'Downtown Loft',
        monthlyRent: 3500,
        dueDate: '2024-02-01',
        status: 'OVERDUE',
        daysOverdue: 15,
        lateFees: 1750,
        priority: 'MEDIUM',
        salespersonName: 'Mike Davis',
        customerPhone: '+1234567891',
        customerEmail: 'bob@example.com',
        lastContact: '2024-01-28',
        contactAttempts: 2,
        notes: 'Customer out of town, will return next week',
      },
      {
        _id: 'rent_3',
        rentalId: 'RENTAL-2024-003',
        customerName: 'Carol Brown',
        propertyTitle: 'Suburban House',
        monthlyRent: 4500,
        dueDate: '2024-03-01',
        status: 'PENDING',
        daysOverdue: 0,
        lateFees: 0,
        priority: 'LOW',
        salespersonName: 'Lisa Johnson',
        customerPhone: '+1234567892',
        customerEmail: 'carol@example.com',
        lastContact: '2024-01-30',
        contactAttempts: 1,
        notes: 'Customer confirmed payment will be made on time',
      },
      {
        _id: 'rent_4',
        rentalId: 'RENTAL-2024-004',
        customerName: 'David Wilson',
        propertyTitle: 'Luxury Penthouse',
        monthlyRent: 8000,
        dueDate: '2024-02-01',
        status: 'OVERDUE',
        daysOverdue: 15,
        lateFees: 4000,
        priority: 'CRITICAL',
        salespersonName: 'Sarah Wilson',
        customerPhone: '+1234567893',
        customerEmail: 'david@example.com',
        lastContact: '2024-01-20',
        contactAttempts: 5,
        notes: 'Legal action may be required, customer unresponsive',
      },
      {
        _id: 'rent_5',
        rentalId: 'RENTAL-2024-005',
        customerName: 'Emma Davis',
        propertyTitle: 'Garden Villa',
        monthlyRent: 5500,
        dueDate: '2024-03-01',
        status: 'PENDING',
        daysOverdue: 0,
        lateFees: 0,
        priority: 'MEDIUM',
        salespersonName: 'Mike Davis',
        customerPhone: '+1234567894',
        customerEmail: 'emma@example.com',
        lastContact: '2024-02-01',
        contactAttempts: 1,
        notes: 'Customer requested payment extension',
      },
    ];

    setPendingRents(mockRents);
    
    // Calculate stats
    const total = mockRents.length;
    const totalAmount = mockRents.reduce((sum, rent) => sum + rent.monthlyRent, 0);
    const overdue = mockRents.filter(rent => rent.status === 'OVERDUE').length;
    const dueThisWeek = mockRents.filter(rent => {
      const dueDate = new Date(rent.dueDate);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;
    const dueThisMonth = mockRents.filter(rent => {
      const dueDate = new Date(rent.dueDate);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'gray';
    }
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

  const handleRecordPayment = (rent) => {
    setSelectedRent(rent);
    setPaymentForm({
      amount: (rent.monthlyRent + rent.lateFees).toString(),
      paymentMode: 'BANK_TRANSFER',
      notes: '',
    });
    onPaymentModalOpen();
  };

  const handlePaymentSubmit = () => {
    // Mock payment recording
    const updatedRents = pendingRents.map(rent => 
      rent._id === selectedRent._id 
        ? { ...rent, status: 'PAID', paidDate: new Date().toISOString() }
        : rent
    );
    
    setPendingRents(updatedRents);
    onPaymentModalClose();
  };

  const handleContactCustomer = (rent) => {
    setSelectedContact(rent);
    setContactForm({
      contactType: 'PHONE',
      message: `Hi ${rent.customerName}, this is a reminder about your overdue rent payment for ${rent.propertyTitle}. The amount due is ${formatCurrency(rent.monthlyRent + rent.lateFees)}. Please contact us to arrange payment.`,
      followUpDate: '',
    });
    onContactModalOpen();
  };

  const handleContactSubmit = () => {
    // Mock contact action
    console.log(`Contacting ${selectedContact.customerName} via ${contactForm.contactType}`);
    onContactModalClose();
  };

  const handleSendReminder = (rent) => {
    // Mock reminder action
    console.log(`Sending reminder to ${rent.customerName} for rent payment`);
  };



  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={2}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Pending Rents
          </Text>
          <Text fontSize="lg" color="gray.600">
            Track and manage pending rent payments across all rental bookings
          </Text>
        </VStack>
        
        <Button
          leftIcon={<FiPlus />}
          onClick={() => navigate('/rental-bookings/all')}
          colorScheme="blue"
          size="lg"
        >
          View All Rentals
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
                10% from last month
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
                15% from last month
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
                8% from last month
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
                5% from last week
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
                12% from last month
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
            <AlertTitle>Overdue Rent Payments!</AlertTitle>
            <AlertDescription>
              You have {stats.overdue} overdue rent payment(s) totaling {formatCurrency(
                pendingRents
                  .filter(rent => rent.status === 'OVERDUE')
                  .reduce((sum, rent) => sum + rent.monthlyRent + rent.lateFees, 0)
              )}. Please follow up with tenants immediately.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Rents Table */}
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Rental ID</Th>
                  <Th>Customer</Th>
                  <Th>Property</Th>
                  <Th>Due Date</Th>
                  <Th>Amount + Fees</Th>
                  <Th>Status</Th>
                  <Th>Priority</Th>
                  <Th>Salesperson</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pendingRents.map((rent) => (
                  <Tr key={rent._id}>
                    <Td>
                      <Text fontWeight="semibold" color="blue.600">
                        {rent.rentalId}
                      </Text>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{rent.customerName}</Text>
                        <Text fontSize="sm" color="gray.600">{rent.customerEmail}</Text>
                        <Text fontSize="sm" color="gray.600">{rent.customerPhone}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{rent.propertyTitle}</Text>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm">{formatDate(rent.dueDate)}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {getDaysUntil(rent.dueDate) < 0 
                            ? `${Math.abs(getDaysUntil(rent.dueDate))} days ago`
                            : `${getDaysUntil(rent.dueDate)} days left`
                          }
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" color="green.600">
                          {formatCurrency(rent.monthlyRent)}
                        </Text>
                        {rent.lateFees > 0 && (
                          <Text fontSize="xs" color="red.600">
                            +{formatCurrency(rent.lateFees)} late fees
                          </Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={getStatusColor(rent.status, rent.daysOverdue)} 
                        variant="subtle"
                      >
                        {rent.status === 'OVERDUE' ? `OVERDUE (${rent.daysOverdue} days)` : 'PENDING'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getPriorityColor(rent.priority)} variant="subtle">
                        {rent.priority}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{rent.salespersonName}</Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label="Record Payment">
                          <IconButton
                            icon={<FiCheckCircle />}
                            onClick={() => handleRecordPayment(rent)}
                            variant="ghost"
                            colorScheme="green"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="Contact Customer">
                          <IconButton
                            icon={<FiPhone />}
                            onClick={() => handleContactCustomer(rent)}
                            variant="ghost"
                            colorScheme="blue"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="Send Reminder">
                          <IconButton
                            icon={<FiMail />}
                            onClick={() => handleSendReminder(rent)}
                            variant="ghost"
                            colorScheme="orange"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="View Details">
                          <IconButton
                            icon={<FiEye />}
                            onClick={() => navigate(`/rental-bookings/${rent.rentalId}`)}
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
          <ModalHeader>Record Rent Payment</ModalHeader>
          <ModalBody>
            {selectedRent && (
              <VStack spacing={4} align="stretch">
                <Box p={4} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <Text fontSize="sm" color="blue.600">Customer</Text>
                  <Text fontWeight="semibold" color="blue.700">{selectedRent.customerName}</Text>
                  <Text fontSize="sm" color="blue.600">Property: {selectedRent.propertyTitle}</Text>
                  <Text fontSize="sm" color="blue.600">Due Date: {formatDate(selectedRent.dueDate)}</Text>
                </Box>

                <FormControl>
                  <FormLabel>Payment Amount</FormLabel>
                  <NumberInput
                    value={paymentForm.amount}
                    onChange={(value) => setPaymentForm(prev => ({ ...prev, amount: value }))}
                    min={0}
                    max={selectedRent.monthlyRent + selectedRent.lateFees}
                  >
                    <NumberInputField placeholder="Enter payment amount" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="sm" color="gray.600">
                    Due: {formatCurrency(selectedRent.monthlyRent)}
                    {selectedRent.lateFees > 0 && ` + Late Fees: ${formatCurrency(selectedRent.lateFees)}`}
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

      {/* Contact Customer Modal */}
      <Modal isOpen={isContactModalOpen} onClose={onContactModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contact Customer</ModalHeader>
          <ModalBody>
            {selectedContact && (
              <VStack spacing={4} align="stretch">
                <Box p={4} bg="orange.50" borderRadius="md" border="1px" borderColor="orange.200">
                  <Text fontSize="sm" color="orange.600">Customer</Text>
                  <Text fontWeight="semibold" color="orange.700">{selectedContact.customerName}</Text>
                  <Text fontSize="sm" color="orange.600">Property: {selectedContact.propertyTitle}</Text>
                  <Text fontSize="sm" color="orange.600">Overdue Amount: {formatCurrency(selectedContact.monthlyRent + selectedContact.lateFees)}</Text>
                </Box>

                <FormControl>
                  <FormLabel>Contact Method</FormLabel>
                  <Select
                    value={contactForm.contactType}
                    onChange={(e) => setContactForm(prev => ({ ...prev, contactType: e.target.value }))}
                  >
                    <option value="PHONE">Phone Call</option>
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="WHATSAPP">WhatsApp</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Follow-up Date</FormLabel>
                  <Input
                    type="date"
                    value={contactForm.followUpDate}
                    onChange={(e) => setContactForm(prev => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onContactModalClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleContactSubmit}>
                Send Contact
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PendingRents; 