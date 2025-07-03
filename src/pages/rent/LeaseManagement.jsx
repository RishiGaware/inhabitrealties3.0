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
  Spinner,
  Center,
  Heading,
  Textarea,
  Checkbox,
} from "@chakra-ui/react";
import { FiPlus, FiEye, FiDownload, FiFilter } from "react-icons/fi";

// Placeholder for API call
const fetchLeaseData = async () => {
  console.log("Fetching lease data...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "lease1",
          property: "Sunset Apartments",
          unit: "A-101",
          tenant: "Alice Johnson",
          startDate: "2023-07-01",
          endDate: "2024-06-30",
          status: "Active",
          rent: 1200,
          documentUrl: "/documents/lease_A101.pdf",
        },
        {
          id: "lease2",
          property: "Sunset Apartments",
          unit: "B-203",
          tenant: "Bob Williams",
          startDate: "2024-06-01",
          endDate: "2025-05-31",
          status: "Active",
          rent: 1450,
          documentUrl: "/documents/lease_B203.pdf",
        },
        {
          id: "lease3",
          property: "Oceanview Condos",
          unit: "C-305",
          tenant: "Charlie Brown",
          startDate: "2022-08-01",
          endDate: "2024-07-31",
          status: "Expiring Soon",
          rent: 2100,
          documentUrl: "/documents/lease_C305.pdf",
        },
        {
          id: "lease4",
          property: "Green Valley Homes",
          unit: "D-10",
          tenant: "Diana Miller",
          startDate: "2023-01-15",
          endDate: "2024-01-14",
          status: "Expired",
          rent: 1800,
          documentUrl: "/documents/lease_D10.pdf",
        },
      ]);
    }, 1000);
  });
};

const LeaseManagement = () => {
  const [leases, setLeases] = useState([]);
  const [filteredLeases, setFilteredLeases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isNewLeaseOpen, setIsNewLeaseOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const data = await fetchLeaseData();
      setLeases(data);
      setFilteredLeases(data);
      setIsLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredLeases(leases);
    } else {
      setFilteredLeases(leases.filter((lease) => lease.status === filter));
    }
  }, [filter, leases]);
  
  const handleViewLease = (lease) => {
    setSelectedLease(lease);
    onOpen();
  };

  const handleAddNewLease = (e) => {
    e.preventDefault();
    // Placeholder for API call to add new lease
    toast({
        title: "Lease Created",
        description: `New lease agreement has been successfully created.`,
        status: "success",
        duration: 5000,
        isClosable: true,
    });
    setIsNewLeaseOpen(false);
  }

  const getStatusColor = (status) => {
    if (status === "Active") return "green";
    if (status === "Expiring Soon") return "orange";
    if (status === "Expired") return "red";
    return "gray";
  };
  
  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.primary" />
          <Text>Loading Leases...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
        <Flex direction={{base: "column", md: "row"}} justify="space-between" mb={6}>
            <VStack align="start">
                <Heading as="h1" size="lg">Lease Management</Heading>
                <Text color="gray.500">Oversee all rental lease agreements.</Text>
            </VStack>
            <Button
                leftIcon={<FiPlus />}
                colorScheme="brand"
                onClick={() => setIsNewLeaseOpen(true)}
                mt={{base: 4, md: 0}}
            >
            Add New Lease
            </Button>
        </Flex>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <FormControl maxW="200px">
          <FormLabel>Filter by Status</FormLabel>
          <Select onChange={(e) => setFilter(e.target.value)} icon={<FiFilter/>}>
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </Select>
        </FormControl>
      </HStack>

      {/* Leases Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Property / Unit</Th>
              <Th>Tenant</Th>
              <Th>Term</Th>
              <Th isNumeric>Rent</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredLeases.map((lease) => (
              <Tr key={lease.id}>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{lease.property}</Text>
                    <Text fontSize="sm" color="gray.500">Unit {lease.unit}</Text>
                  </VStack>
                </Td>
                <Td>{lease.tenant}</Td>
                <Td>{lease.startDate} to {lease.endDate}</Td>
                <Td isNumeric>${lease.rent.toLocaleString()}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(lease.status)}>{lease.status}</Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton icon={<FiEye />} size="sm" variant="ghost" colorScheme="blue" aria-label="View Lease" onClick={() => handleViewLease(lease)} />
                    <IconButton as="a" href={lease.documentUrl} target="_blank" icon={<FiDownload />} size="sm" variant="ghost" colorScheme="green" aria-label="Download Lease" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* View Lease Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lease Details - {selectedLease?.property} Unit {selectedLease?.unit}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedLease && (
              <VStack spacing={4} align="start">
                <Text><strong>Tenant:</strong> {selectedLease.tenant}</Text>
                <Text><strong>Term:</strong> {selectedLease.startDate} to {selectedLease.endDate}</Text>
                <Text><strong>Rent:</strong> ${selectedLease.rent.toLocaleString()} / month</Text>
                <Badge colorScheme={getStatusColor(selectedLease.status)}>{selectedLease.status}</Badge>
                <Text><strong>Document:</strong> <Button as="a" href={selectedLease.documentUrl} target="_blank" size="sm" rightIcon={<FiDownload />}>Download PDF</Button></Text>
                <Box as="iframe" src={selectedLease.documentUrl} width="100%" height="400px" title="Lease Document" />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add New Lease Modal */}
      <Modal isOpen={isNewLeaseOpen} onClose={() => setIsNewLeaseOpen(false)} size="2xl">
        <ModalOverlay />
        <ModalContent>
            <form onSubmit={handleAddNewLease}>
                <ModalHeader>Create New Lease Agreement</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <HStack w="full" spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Property</FormLabel>
                                <Input placeholder="e.g., Sunset Apartments" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Unit</FormLabel>
                                <Input placeholder="e.g., A-101" />
                            </FormControl>
                        </HStack>
                        <FormControl isRequired>
                            <FormLabel>Tenant Name</FormLabel>
                            <Input placeholder="e.g., John Doe" />
                        </FormControl>
                        <HStack w="full" spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Lease Start Date</FormLabel>
                                <Input type="date" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Lease End Date</FormLabel>
                                <Input type="date" />
                            </FormControl>
                        </HStack>
                        <HStack w="full" spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Monthly Rent</FormLabel>
                                <Input type="number" placeholder="e.g., 1200" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Security Deposit</FormLabel>
                                <Input type="number" placeholder="e.g., 1200" />
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel>Lease Terms & Clauses</FormLabel>
                            <Textarea placeholder="Add any specific terms, clauses, or notes here..." />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Upload Lease Document</FormLabel>
                            <Input type="file" p={1.5} />
                        </FormControl>
                        <FormControl>
                           <Checkbox>Send copy to tenant's email</Checkbox>
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={() => setIsNewLeaseOpen(false)}>
                    Cancel
                    </Button>
                    <Button colorScheme="brand" type="submit">
                    Create Lease
                    </Button>
                </ModalFooter>
            </form>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default LeaseManagement; 