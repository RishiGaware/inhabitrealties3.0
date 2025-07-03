import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Text,
  useToast,
  IconButton,
  Flex,
  Badge,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { FiMail, FiChevronLeft, FiChevronRight, FiSearch, FiAlertTriangle } from "react-icons/fi";

// Dummy data for pending payments
const dummyPendingPayments = [
  {
    _id: "1",
    propertyName: "Sunset Villa",
    buyerName: "John Doe",
    buyerEmail: "john.doe@example.com",
    buyerPhone: "+1234567890",
    dueAmount: 500000,
    dueDate: "2024-04-15",
    overdueDays: 5,
    installmentNumber: 3,
    totalInstallments: 5,
    status: "OVERDUE",
  },
  {
    _id: "2",
    propertyName: "Garden Heights",
    buyerName: "Mike Johnson",
    buyerEmail: "mike.johnson@example.com",
    buyerPhone: "+1122334455",
    dueAmount: 800000,
    dueDate: "2024-04-20",
    overdueDays: 0,
    installmentNumber: 2,
    totalInstallments: 4,
    status: "DUE_TODAY",
  },
  {
    _id: "3",
    propertyName: "City Center Plaza",
    buyerName: "Sarah Wilson",
    buyerEmail: "sarah.wilson@example.com",
    buyerPhone: "+1555666777",
    dueAmount: 600000,
    dueDate: "2024-04-10",
    overdueDays: 10,
    installmentNumber: 4,
    totalInstallments: 7,
    status: "OVERDUE",
  },
  {
    _id: "4",
    propertyName: "Ocean View Apartment",
    buyerName: "Jane Smith",
    buyerEmail: "jane.smith@example.com",
    buyerPhone: "+1987654321",
    dueAmount: 400000,
    dueDate: "2024-04-25",
    overdueDays: -5,
    installmentNumber: 1,
    totalInstallments: 3,
    status: "UPCOMING",
  },
  {
    _id: "5",
    propertyName: "Luxury Penthouse",
    buyerName: "David Brown",
    buyerEmail: "david.brown@example.com",
    buyerPhone: "+1888999000",
    dueAmount: 750000,
    dueDate: "2024-04-05",
    overdueDays: 15,
    installmentNumber: 2,
    totalInstallments: 6,
    status: "OVERDUE",
  },
];

const PendingPayments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");
  const itemsPerPage = 10;
  const toast = useToast();

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = () => {
    setLoading(true);
    try {
      // Using dummy data
      setPendingPayments(dummyPendingPayments);
    } catch (error) {
      toast({
        title: "Error loading pending payments",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter pending payments
  const filteredPayments = pendingPayments.filter(payment => {
    const matchesSearch = payment.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    const matchesProperty = !propertyFilter || payment.propertyName === propertyFilter;
    return matchesSearch && matchesStatus && matchesProperty;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handleSendReminder = async (payment) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Reminder sent successfully",
        description: `Payment reminder sent to ${payment.buyerName}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error sending reminder",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusBadge = (status, overdueDays) => {
    const statusConfig = {
      OVERDUE: { color: "red", text: `Overdue (${overdueDays} days)` },
      DUE_TODAY: { color: "orange", text: "Due Today" },
      UPCOMING: { color: "blue", text: "Upcoming" },
    };
    
    const config = statusConfig[status] || { color: "gray", text: status };
    
    return (
      <Badge colorScheme={config.color} variant="subtle" px={2} py={1} borderRadius="full">
        {config.text}
      </Badge>
    );
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

  // Calculate summary statistics
  const overduePayments = filteredPayments.filter(p => p.status === 'OVERDUE');
  const dueTodayPayments = filteredPayments.filter(p => p.status === 'DUE_TODAY');
  const totalOverdueAmount = overduePayments.reduce((sum, p) => sum + p.dueAmount, 0);
  const totalDueTodayAmount = dueTodayPayments.reduce((sum, p) => sum + p.dueAmount, 0);

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="light.darkText">
            Pending Payments
          </Text>
          <Button colorScheme="brand" size="sm">
            Export Report
          </Button>
        </Flex>

        {/* Summary Cards */}
        <HStack spacing={6}>
          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel color="red.500">Overdue Payments</StatLabel>
                <StatNumber color="red.500">{overduePayments.length}</StatNumber>
                <StatHelpText>{formatCurrency(totalOverdueAmount)}</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel color="orange.500">Due Today</StatLabel>
                <StatNumber color="orange.500">{dueTodayPayments.length}</StatNumber>
                <StatHelpText>{formatCurrency(totalDueTodayAmount)}</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel>Total Pending</StatLabel>
                <StatNumber>{filteredPayments.length}</StatNumber>
                <StatHelpText>
                  {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.dueAmount, 0))}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </HStack>

        {/* Filters */}
        <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <HStack spacing={4} mb={4}>
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <input
                type="text"
                placeholder="Search by property, buyer, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </InputGroup>
            
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              width="200px"
            >
              <option value="OVERDUE">Overdue</option>
              <option value="DUE_TODAY">Due Today</option>
              <option value="UPCOMING">Upcoming</option>
            </Select>
            
            <Select
              placeholder="Filter by property"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              width="200px"
            >
              {Array.from(new Set(pendingPayments.map(p => p.propertyName))).map(property => (
                <option key={property} value={property}>{property}</option>
              ))}
            </Select>
          </HStack>
          
          <Text fontSize="sm" color="gray.600">
            Showing {filteredPayments.length} of {pendingPayments.length} pending payments
          </Text>
        </Box>

        {/* Pending Payments Table */}
        <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Property & Buyer</Th>
                <Th>Due Amount</Th>
                <Th>Due Date</Th>
                <Th>Installment</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentPayments.map((payment) => (
                <Tr key={payment._id}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{payment.propertyName}</Text>
                      <Text fontSize="sm" color="gray.500">{payment.buyerName}</Text>
                      <Text fontSize="xs" color="gray.400">{payment.buyerEmail}</Text>
                    </VStack>
                  </Td>
                  <Td>
                    <Text fontWeight="medium" color="red.500">
                      {formatCurrency(payment.dueAmount)}
                    </Text>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text>{formatDate(payment.dueDate)}</Text>
                      {payment.overdueDays > 0 && (
                        <Text fontSize="xs" color="red.500">
                          {payment.overdueDays} days overdue
                        </Text>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {payment.installmentNumber} of {payment.totalInstallments}
                    </Text>
                  </Td>
                  <Td>
                    {getStatusBadge(payment.status, payment.overdueDays)}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Send reminder"
                        icon={<FiMail />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleSendReminder(payment)}
                      />
                      <Button size="sm" colorScheme="brand">
                        Add Payment
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination */}
        <Flex justify="center" align="center" gap={4}>
          <Button
            leftIcon={<FiChevronLeft />}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
            variant="outline"
            colorScheme="brand"
            size="sm"
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            rightIcon={<FiChevronRight />}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            isDisabled={currentPage === totalPages}
            variant="outline"
            colorScheme="brand"
            size="sm"
          >
            Next
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default PendingPayments; 