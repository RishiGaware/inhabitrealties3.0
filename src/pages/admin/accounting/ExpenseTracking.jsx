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
  Spinner,
  Center,
  Heading,
  Textarea,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
} from "@chakra-ui/react";
import { FiPlus, FiFilter, FiEdit, FiTrash2, FiPaperclip } from "react-icons/fi";

// Placeholder for API call
const fetchExpenses = async () => {
  console.log("Fetching expenses...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "exp1",
          date: "2024-06-25",
          category: "Maintenance",
          property: "Sunset Apartments",
          amount: 250.75,
          vendor: "City Plumbers",
          description: "Fixed leak in Unit A-101 bathroom.",
          receiptUrl: "/receipts/receipt1.pdf",
        },
        {
          id: "exp2",
          date: "2024-06-22",
          category: "Utilities",
          property: "Oceanview Condos",
          amount: 850.0,
          vendor: "City Power & Light",
          description: "Monthly electricity bill for common areas.",
          receiptUrl: null,
        },
        {
          id: "exp3",
          date: "2024-06-20",
          category: "Marketing",
          property: "N/A",
          amount: 500.0,
          vendor: "Online Ads Inc.",
          description: "Digital marketing campaign for new listings.",
          receiptUrl: "/receipts/receipt3.pdf",
        },
        {
          id: "exp4",
          date: "2024-06-18",
          category: "Repairs",
          property: "Green Valley Homes",
          amount: 1200.0,
          vendor: "Roofer's Choice",
          description: "Roof repair for Unit D-10 after storm damage.",
          receiptUrl: "/receipts/receipt4.pdf",
        },
      ]);
    }, 1000);
  });
};

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "all", property: "all" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
      setFilteredExpenses(data);
      setIsLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    let data = [...expenses];
    if (filters.category !== "all") {
      data = data.filter((item) => item.category === filters.category);
    }
    if (filters.property !== "all") {
      data = data.filter((item) => item.property === filters.property);
    }
    setFilteredExpenses(data);
  }, [filters, expenses]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
        setIsEditing(true);
        setSelectedExpense(expense);
    } else {
        setIsEditing(false);
        setSelectedExpense(null);
    }
    onOpen();
  };
  
  const handleDelete = (id) => {
    // Placeholder for delete API call
    setExpenses(expenses.filter(exp => exp.id !== id));
    toast({
        title: "Expense Deleted",
        status: "info",
        duration: 3000,
        isClosable: true
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newExpense = Object.fromEntries(formData.entries());
    
    // Placeholder for create/update API call
    if (isEditing) {
        setExpenses(expenses.map(exp => exp.id === selectedExpense.id ? {...selectedExpense, ...newExpense, amount: parseFloat(newExpense.amount)} : exp));
        toast({ title: "Expense Updated", status: "success", duration: 3000, isClosable: true });
    } else {
        setExpenses([{id: `exp${Date.now()}`, ...newExpense, amount: parseFloat(newExpense.amount)}, ...expenses]);
        toast({ title: "Expense Added", status: "success", duration: 3000, isClosable: true });
    }
    onClose();
  };
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.primary" />
          <Text>Loading Expenses...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" mb={6}>
        <VStack align="start">
          <Heading as="h1" size="lg">Expense Tracking</Heading>
          <Text color="gray.500">Log and manage all business-related expenses.</Text>
        </VStack>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={() => handleOpenModal()}
          mt={{ base: 4, md: 0 }}
        >
          Add Expense
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={6}>
          <Card>
              <CardBody>
                  <Stat>
                      <StatLabel>Total Expenses (All Time)</StatLabel>
                      <StatNumber>${totalExpenses.toLocaleString()}</StatNumber>
                  </Stat>
              </CardBody>
          </Card>
          {/* Other stats can be added here */}
      </SimpleGrid>

      {/* Filters */}
      <HStack spacing={4} mb={6} flexWrap="wrap">
        <FormControl>
          <FormLabel>Filter by Category</FormLabel>
          <Select name="category" onChange={handleFilterChange} icon={<FiFilter />}>
            <option value="all">All Categories</option>
            {[...new Set(expenses.map(item => item.category))].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Filter by Property</FormLabel>
          <Select name="property" onChange={handleFilterChange} icon={<FiFilter />}>
            <option value="all">All Properties</option>
            {[...new Set(expenses.map(item => item.property))].map(prop => (
                <option key={prop} value={prop}>{prop}</option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      {/* Expenses Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Category</Th>
              <Th>Property</Th>
              <Th>Vendor</Th>
              <Th isNumeric>Amount</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredExpenses.map((expense) => (
              <Tr key={expense.id}>
                <Td>{expense.date}</Td>
                <Td><Tag>{expense.category}</Tag></Td>
                <Td>{expense.property}</Td>
                <Td>{expense.vendor}</Td>
                <Td isNumeric>${expense.amount.toFixed(2)}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton icon={<FiEdit />} size="sm" variant="ghost" colorScheme="brand" aria-label="Edit Expense" onClick={() => handleOpenModal(expense)} />
                    <IconButton icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" aria-label="Delete Expense" onClick={() => handleDelete(expense.id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Add/Edit Expense Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{isEditing ? 'Edit Expense' : 'Add New Expense'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input name="date" type="date" defaultValue={selectedExpense?.date} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select name="category" defaultValue={selectedExpense?.category}>
                    <option>Maintenance</option>
                    <option>Repairs</option>
                    <option>Utilities</option>
                    <option>Marketing</option>
                    <option>Insurance</option>
                    <option>Taxes</option>
                    <option>Management Fees</option>
                    <option>Other</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Amount</FormLabel>
                  <Input name="amount" type="number" step="0.01" defaultValue={selectedExpense?.amount} />
                </FormControl>
                <FormControl>
                  <FormLabel>Property</FormLabel>
                  <Input name="property" placeholder="e.g., Sunset Apartments or N/A" defaultValue={selectedExpense?.property} />
                </FormControl>
                <FormControl>
                  <FormLabel>Vendor</FormLabel>
                  <Input name="vendor" placeholder="e.g., City Plumbers" defaultValue={selectedExpense?.vendor} />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea name="description" defaultValue={selectedExpense?.description} />
                </FormControl>
                <FormControl>
                  <FormLabel>Upload Receipt</FormLabel>
                  <Input name="receiptUrl" type="file" p={1.5} icon={<FiPaperclip />} />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" type="submit">
                {isEditing ? 'Save Changes' : 'Add Expense'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExpenseTracking; 