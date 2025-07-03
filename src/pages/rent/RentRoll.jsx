import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  IconButton,
  Flex,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiPlus, FiEdit, FiDollarSign, FiEye, FiFilter, FiHome } from "react-icons/fi";

// Placeholder for API call
const fetchRentRollData = async () => {
  console.log("Fetching rent roll data...");
  // Replace with actual API call, e.g., axios.get('/api/rent-roll')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "rr1",
          property: "Sunset Apartments",
          unit: "A-101",
          tenant: "Alice Johnson",
          rent: 1200,
          dueDate: "2024-07-01",
          status: "Paid",
          lastPaymentDate: "2024-06-28",
        },
        {
          id: "rr2",
          property: "Sunset Apartments",
          unit: "B-203",
          tenant: "Bob Williams",
          rent: 1450,
          dueDate: "2024-07-01",
          status: "Overdue",
          lastPaymentDate: "2024-05-30",
        },
        {
          id: "rr3",
          property: "Oceanview Condos",
          unit: "C-305",
          tenant: "Charlie Brown",
          rent: 2100,
          dueDate: "2024-07-05",
          status: "Pending",
          lastPaymentDate: "2024-06-05",
        },
        {
          id: "rr4",
          property: "Green Valley Homes",
          unit: "D-10",
          tenant: "Diana Miller",
          rent: 1800,
          dueDate: "2024-07-01",
          status: "Paid",
          lastPaymentDate: "2024-07-01",
        },
        {
            id: "rr5",
            property: "Sunset Apartments",
            unit: "A-102",
            tenant: "Eve Davis",
            rent: 1250,
            dueDate: "2024-07-01",
            status: "Paid",
            lastPaymentDate: "2024-06-29",
          },
          {
            id: "rr6",
            property: "Oceanview Condos",
            unit: "C-308",
            tenant: "Frank White",
            rent: 2150,
            dueDate: "2024-07-05",
            status: "Overdue",
            lastPaymentDate: "2024-05-06",
          },
      ]);
    }, 1000);
  });
};

const RentRoll = () => {
  const [rentData, setRentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ property: "all", status: "all" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const data = await fetchRentRollData();
      setRentData(data);
      setFilteredData(data);
      setIsLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    let data = [...rentData];
    if (filters.property !== "all") {
      data = data.filter((item) => item.property === filters.property);
    }
    if (filters.status !== "all") {
      data = data.filter((item) => item.status === filters.status);
    }
    setFilteredData(data);
  }, [filters, rentData]);
  
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const handleRecordPayment = (record) => {
    setSelectedRecord(record);
    onOpen();
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting payment for:", selectedRecord);
    // Placeholder for API call to record payment
    toast({
        title: "Payment Recorded",
        description: `Payment for ${selectedRecord.tenant} has been successfully recorded.`,
        status: "success",
        duration: 5000,
        isClosable: true,
    });
    onClose();
    // Refetch or update data locally
    const updatedData = rentData.map(item => 
        item.id === selectedRecord.id ? {...item, status: 'Paid', lastPaymentDate: new Date().toISOString().split('T')[0]} : item
    );
    setRentData(updatedData);
  };
  
  const getStatusColor = (status) => {
    if (status === "Paid") return "green";
    if (status === "Overdue") return "red";
    if (status === "Pending") return "orange";
    return "gray";
  };
  
  const totalRent = rentData.reduce((sum, item) => sum + item.rent, 0);
  const overdueRent = rentData.filter(item => item.status === 'Overdue').reduce((sum, item) => sum + item.rent, 0);
  const occupancyRate = rentData.length > 0 ? ((rentData.filter(item => item.tenant).length / rentData.length) * 100).toFixed(0) : 0;
  
  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.primary" />
          <Text>Loading Rent Roll...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Flex direction={{base: "column", md: "row"}} justify="space-between" mb={6}>
        <VStack align="start">
            <Heading as="h1" size="lg">
            Rent Roll
            </Heading>
            <Text color="gray.500">
            Track and manage all your rental income streams.
            </Text>
        </VStack>
        <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            onClick={() => {
            /* Logic to add a new rental unit */
            }}
            mt={{base: 4, md: 0}}
        >
          Add Rental Unit
        </Button>
      </Flex>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Monthly Rent</StatLabel>
              <StatNumber>${totalRent.toLocaleString()}</StatNumber>
              <StatHelpText>Expected Total</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Overdue Rent</StatLabel>
              <StatNumber color="red.500">${overdueRent.toLocaleString()}</StatNumber>
              <StatHelpText>Action Required</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Occupancy Rate</StatLabel>
              <StatNumber>{occupancyRate}%</StatNumber>
              <StatHelpText>Based on listed units</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Units</StatLabel>
              <StatNumber>{rentData.length}</StatNumber>
              <StatHelpText>All Properties</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <HStack spacing={4} mb={6} flexWrap="wrap">
        <FormControl>
          <FormLabel>Filter by Property</FormLabel>
          <Select name="property" onChange={handleFilterChange} icon={<FiHome/>}>
            <option value="all">All Properties</option>
            {[...new Set(rentData.map(item => item.property))].map(prop => (
                <option key={prop} value={prop}>{prop}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Filter by Status</FormLabel>
          <Select name="status" onChange={handleFilterChange} icon={<FiFilter/>}>
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Pending">Pending</option>
          </Select>
        </FormControl>
      </HStack>

      {/* Rent Roll Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Property / Unit</Th>
              <Th>Tenant</Th>
              <Th isNumeric>Rent</Th>
              <Th>Due Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{item.property}</Text>
                    <Text fontSize="sm" color="gray.500">Unit {item.unit}</Text>
                  </VStack>
                </Td>
                <Td>{item.tenant}</Td>
                <Td isNumeric>${item.rent.toLocaleString()}</Td>
                <Td>{item.dueDate}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(item.status)}>{item.status}</Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton icon={<FiDollarSign />} size="sm" variant="ghost" colorScheme="green" aria-label="Record Payment" onClick={() => handleRecordPayment(item)} />
                    <IconButton icon={<FiEye />} size="sm" variant="ghost" colorScheme="blue" aria-label="View Ledger" />
                    <IconButton icon={<FiEdit />} size="sm" variant="ghost" colorScheme="brand" aria-label="Edit Record" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      {/* Record Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Payment for {selectedRecord?.tenant}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handlePaymentSubmit}>
          <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Payment Amount</FormLabel>
                  <Input type="number" defaultValue={selectedRecord?.rent} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Payment Date</FormLabel>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </FormControl>
                <FormControl>
                  <FormLabel>Payment Method</FormLabel>
                  <Select placeholder="Select method">
                    <option>Bank Transfer</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                    <option>Check</option>
                  </Select>
                </FormControl>
              </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" type="submit">
              Confirm Payment
            </Button>
          </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default RentRoll; 