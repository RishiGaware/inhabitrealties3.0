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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FiEye, FiEdit, FiDollarSign, FiCalendar, FiClock, FiAlertTriangle, FiCheckCircle, FiPlus, FiPhone, FiMail, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';

const OverdueInstallments = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const { isOpen: isPaymentModalOpen, onOpen: onPaymentModalOpen, onClose: onPaymentModalClose } = useDisclosure();
  const { isOpen: isContactModalOpen, onOpen: onContactModalOpen, onClose: onContactModalClose } = useDisclosure();
  const [selectedInstallment, setSelectedInstallment] = useState(null);
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

  // Mock data for overdue installments
  const [overdueInstallments, setOverdueInstallments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    totalLateFees: 0,
    critical: 0,
    high: 0,
    medium: 0,
    averageDaysOverdue: 0,
  });

  useEffect(() => {
    // Mock data for overdue installments
    const mockInstallments = [
      {
        _id: 'inst_1',
        bookingId: 'PURCHASE-2024-001',
        customerName: 'John Smith',
        propertyTitle: 'Luxury Apartment Downtown',
        installmentNumber: 2,
        dueDate: '2024-01-15',
        amount: 45000,
        status: 'OVERDUE',
        daysOverdue: 25,
        lateFees: 11250,
        priority: 'CRITICAL',
        salespersonName: 'Alex Thompson',
        customerPhone: '+1234567890',
        customerEmail: 'john@example.com',
        lastContact: '2024-01-20',
        contactAttempts: 3,
        notes: 'Customer experiencing financial difficulties, needs payment plan adjustment',
      },
      {
        _id: 'inst_2',
        bookingId: 'PURCHASE-2024-002',
        customerName: 'Sarah Johnson',
        propertyTitle: 'Modern Villa Suburbs',
        installmentNumber: 1,
        dueDate: '2024-01-20',
        amount: 52000,
        status: 'OVERDUE',
        daysOverdue: 20,
        lateFees: 10400,
        priority: 'HIGH',
        salespersonName: 'Lisa Davis',
        customerPhone: '+1234567891',
        customerEmail: 'sarah@example.com',
        lastContact: '2024-01-25',
        contactAttempts: 2,
        notes: 'Customer out of country, will return next week',
      },
      {
        _id: 'inst_3',
        bookingId: 'PURCHASE-2024-003',
        customerName: 'Mike Wilson',
        propertyTitle: 'Premium Condo',
        installmentNumber: 3,
        dueDate: '2024-01-25',
        amount: 28000,
        status: 'OVERDUE',
        daysOverdue: 15,
        lateFees: 5600,
        priority: 'MEDIUM',
        salespersonName: 'Robert Brown',
        customerPhone: '+1234567892',
        customerEmail: 'mike@example.com',
        lastContact: '2024-01-28',
        contactAttempts: 1,
        notes: 'Customer requested extension, considering options',
      },
      {
        _id: 'inst_4',
        bookingId: 'PURCHASE-2024-004',
        customerName: 'Emily Davis',
        propertyTitle: 'Executive Penthouse',
        installmentNumber: 1,
        dueDate: '2024-01-10',
        amount: 75000,
        status: 'OVERDUE',
        daysOverdue: 30,
        lateFees: 18750,
        priority: 'CRITICAL',
        salespersonName: 'Alex Thompson',
        customerPhone: '+1234567893',
        customerEmail: 'emily@example.com',
        lastContact: '2024-01-15',
        contactAttempts: 5,
        notes: 'Legal action may be required, customer unresponsive',
      },
      {
        _id: 'inst_5',
        bookingId: 'PURCHASE-2024-005',
        customerName: 'David Brown',
        propertyTitle: 'Garden Villa',
        installmentNumber: 2,
        dueDate: '2024-01-30',
        amount: 38000,
        status: 'OVERDUE',
        daysOverdue: 10,
        lateFees: 3800,
        priority: 'MEDIUM',
        salespersonName: 'Lisa Davis',
        customerPhone: '+1234567894',
        customerEmail: 'david@example.com',
        lastContact: '2024-02-01',
        contactAttempts: 1,
        notes: 'Customer promised payment by end of week',
      },
    ];

    setOverdueInstallments(mockInstallments);
    
    // Calculate stats
    const total = mockInstallments.length;
    const totalAmount = mockInstallments.reduce((sum, inst) => sum + inst.amount, 0);
    const totalLateFees = mockInstallments.reduce((sum, inst) => sum + inst.lateFees, 0);
    const critical = mockInstallments.filter(inst => inst.priority === 'CRITICAL').length;
    const high = mockInstallments.filter(inst => inst.priority === 'HIGH').length;
    const medium = mockInstallments.filter(inst => inst.priority === 'MEDIUM').length;
    const averageDaysOverdue = Math.round(
      mockInstallments.reduce((sum, inst) => sum + inst.daysOverdue, 0) / total
    );

    setStats({ total, totalAmount, totalLateFees, critical, high, medium, averageDaysOverdue });
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'CRITICAL': return <FiAlertTriangle color="red" />;
      case 'HIGH': return <FiTrendingUp color="orange" />;
      case 'MEDIUM': return <FiClock color="yellow" />;
      default: return <FiClock color="gray" />;
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

  const handleRecordPayment = (installment) => {
    setSelectedInstallment(installment);
    setPaymentForm({
      amount: (installment.amount + installment.lateFees).toString(),
      paymentMode: 'BANK_TRANSFER',
      notes: '',
    });
    onPaymentModalOpen();
  };

  const handlePaymentSubmit = () => {
    // Mock payment recording
    const updatedInstallments = overdueInstallments.map(inst => 
      inst._id === selectedInstallment._id 
        ? { ...inst, status: 'PAID', paidDate: new Date().toISOString() }
        : inst
    );
    
    setOverdueInstallments(updatedInstallments);
    onPaymentModalClose();
  };

  const handleContactCustomer = (installment) => {
    setSelectedContact(installment);
    setContactForm({
      contactType: 'PHONE',
      message: `Hi ${installment.customerName}, this is a reminder about your overdue installment #${installment.installmentNumber} for ${installment.propertyTitle}. The amount due is ${formatCurrency(installment.amount + installment.lateFees)}. Please contact us to arrange payment.`,
      followUpDate: '',
    });
    onContactModalOpen();
  };

  const handleContactSubmit = () => {
    // Mock contact action
    console.log(`Contacting ${selectedContact.customerName} via ${contactForm.contactType}`);
    onContactModalClose();
  };

  const handleSendReminder = (installment) => {
    // Mock reminder action
    console.log(`Sending reminder to ${installment.customerName} for installment ${installment.installmentNumber}`);
  };

  const handleEscalate = (installment) => {
    // Mock escalation action
    console.log(`Escalating ${installment.customerName} case to management`);
  };

  const getPriorityInstallments = (priority) => {
    return overdueInstallments.filter(inst => inst.priority === priority);
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={2}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Overdue Installments
          </Text>
          <Text fontSize="lg" color="gray.600">
            Manage critical overdue payments and customer follow-ups
          </Text>
        </VStack>
        
        <Button
          leftIcon={<FiPlus />}
          onClick={() => navigate('/purchase-bookings/pending-installments')}
          colorScheme="blue"
          size="lg"
        >
          View Pending
        </Button>
      </Flex>

      {/* Critical Alert */}
      <Alert status="error" mb={6} borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Critical Overdue Installments!</AlertTitle>
          <AlertDescription>
            You have {stats.critical} critical overdue installment(s) requiring immediate attention. 
            Total overdue amount: {formatCurrency(stats.totalAmount + stats.totalLateFees)}
          </AlertDescription>
        </Box>
      </Alert>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Overdue</StatLabel>
              <StatNumber fontSize="3xl" color="red.600">{stats.total}</StatNumber>
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
              <StatLabel color="gray.600">Total Amount</StatLabel>
              <StatNumber fontSize="2xl" color="orange.600">
                {formatCurrency(stats.totalAmount)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                18% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Late Fees</StatLabel>
              <StatNumber fontSize="2xl" color="red.600">
                {formatCurrency(stats.totalLateFees)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                22% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Avg Days Overdue</StatLabel>
              <StatNumber fontSize="3xl" color="purple.600">{stats.averageDaysOverdue}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                8% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Priority Breakdown */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card bg="red.50" border="1px" borderColor="red.200">
          <CardBody textAlign="center">
            <VStack spacing={3}>
              <FiAlertTriangle size={32} color="red" />
              <Text fontSize="2xl" fontWeight="bold" color="red.600">
                {stats.critical}
              </Text>
              <Text fontSize="lg" color="red.700">Critical Priority</Text>
              <Text fontSize="sm" color="red.600">
                {formatCurrency(
                  getPriorityInstallments('CRITICAL').reduce((sum, inst) => sum + inst.amount + inst.lateFees, 0)
                )}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="orange.50" border="1px" borderColor="orange.200">
          <CardBody textAlign="center">
            <VStack spacing={3}>
              <FiTrendingUp size={32} color="orange" />
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                {stats.high}
              </Text>
              <Text fontSize="lg" color="orange.700">High Priority</Text>
              <Text fontSize="sm" color="orange.600">
                {formatCurrency(
                  getPriorityInstallments('HIGH').reduce((sum, inst) => sum + inst.amount + inst.lateFees, 0)
                )}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="yellow.50" border="1px" borderColor="yellow.200">
          <CardBody textAlign="center">
            <VStack spacing={3}>
              <FiClock size={32} color="yellow" />
              <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                {stats.medium}
              </Text>
              <Text fontSize="lg" color="yellow.700">Medium Priority</Text>
              <Text fontSize="sm" color="yellow.600">
                {formatCurrency(
                  getPriorityInstallments('MEDIUM').reduce((sum, inst) => sum + inst.amount + inst.lateFees, 0)
                )}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Priority-based Tabs */}
      <Tabs variant="enclosed" mb={8}>
        <TabList>
          <Tab>
            <HStack>
              <FiAlertTriangle color="red" />
              <Text>Critical ({stats.critical})</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FiTrendingUp color="orange" />
              <Text>High ({stats.high})</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FiClock color="yellow" />
              <Text>Medium ({stats.medium})</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {['CRITICAL', 'HIGH', 'MEDIUM'].map((priority) => (
            <TabPanel key={priority}>
              <Card bg={bgColor} border="1px" borderColor={borderColor}>
                <CardBody>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Customer</Th>
                          <Th>Property</Th>
                          <Th>Due Date</Th>
                          <Th>Amount + Fees</Th>
                          <Th>Days Overdue</Th>
                          <Th>Last Contact</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {getPriorityInstallments(priority).map((installment) => (
                          <Tr key={installment._id}>
                            <Td>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold">{installment.customerName}</Text>
                                <Text fontSize="sm" color="gray.600">{installment.customerEmail}</Text>
                                <Text fontSize="sm" color="gray.600">{installment.customerPhone}</Text>
                              </VStack>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm">{installment.propertyTitle}</Text>
                                <Badge colorScheme="blue" variant="subtle">
                                  #{installment.installmentNumber}
                                </Badge>
                              </VStack>
                            </Td>
                            <Td>
                              <Text fontSize="sm">{formatDate(installment.dueDate)}</Text>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold" color="green.600">
                                  {formatCurrency(installment.amount)}
                                </Text>
                                <Text fontSize="xs" color="red.600">
                                  +{formatCurrency(installment.lateFees)} fees
                                </Text>
                              </VStack>
                            </Td>
                            <Td>
                              <Badge 
                                colorScheme={getPriorityColor(installment.priority)} 
                                variant="subtle"
                              >
                                {installment.daysOverdue} days
                              </Badge>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm">{formatDate(installment.lastContact)}</Text>
                                <Text fontSize="xs" color="gray.500">
                                  {installment.contactAttempts} attempts
                                </Text>
                              </VStack>
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
                                    icon={<FiPhone />}
                                    onClick={() => handleContactCustomer(installment)}
                                    variant="ghost"
                                    colorScheme="blue"
                                    size="sm"
                                  />
                                </Tooltip>
                                <Tooltip label="Send Reminder">
                                  <IconButton
                                    icon={<FiMail />}
                                    onClick={() => handleSendReminder(installment)}
                                    variant="ghost"
                                    colorScheme="orange"
                                    size="sm"
                                  />
                                </Tooltip>
                                <Tooltip label="Escalate">
                                  <IconButton
                                    icon={<FiAlertTriangle />}
                                    onClick={() => handleEscalate(installment)}
                                    variant="ghost"
                                    colorScheme="red"
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
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* Customer Notes Accordion */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} mb={8}>
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>Customer Notes & Follow-up History</Text>
          <Accordion allowMultiple>
            {overdueInstallments.map((installment) => (
              <AccordionItem key={installment._id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      {getPriorityIcon(installment.priority)}
                      <Text fontWeight="semibold">{installment.customerName}</Text>
                      <Badge colorScheme={getPriorityColor(installment.priority)} variant="subtle">
                        {installment.priority}
                      </Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={3}>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">Notes:</Text>
                      <Text fontSize="sm">{installment.notes}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">Last Contact:</Text>
                      <Text fontSize="sm">{formatDate(installment.lastContact)}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">Contact Attempts:</Text>
                      <Text fontSize="sm">{installment.contactAttempts} attempts</Text>
                    </Box>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>

      {/* Payment Recording Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={onPaymentModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Overdue Payment</ModalHeader>
          <ModalBody>
            {selectedInstallment && (
              <VStack spacing={4} align="stretch">
                <Box p={4} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
                  <Text fontSize="sm" color="red.600">Customer</Text>
                  <Text fontWeight="semibold" color="red.700">{selectedInstallment.customerName}</Text>
                  <Text fontSize="sm" color="red.600">Property: {selectedInstallment.propertyTitle}</Text>
                  <Text fontSize="sm" color="red.600">Installment #{selectedInstallment.installmentNumber}</Text>
                  <Text fontSize="sm" color="red.600">Days Overdue: {selectedInstallment.daysOverdue}</Text>
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

      {/* Contact Customer Modal */}
      <Modal isOpen={isContactModalOpen} onClose={onContactModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contact Customer</ModalHeader>
          <ModalBody>
            {selectedContact && (
              <VStack spacing={4} align="stretch">
                <Box p={4} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <Text fontSize="sm" color="blue.600">Customer</Text>
                  <Text fontWeight="semibold" color="blue.700">{selectedContact.customerName}</Text>
                  <Text fontSize="sm" color="blue.600">Property: {selectedContact.propertyTitle}</Text>
                  <Text fontSize="sm" color="blue.600">Overdue Amount: {formatCurrency(selectedContact.amount + selectedContact.lateFees)}</Text>
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

export default OverdueInstallments; 