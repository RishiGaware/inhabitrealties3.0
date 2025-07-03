import React, { useState } from 'react';
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
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  IconButton,
  Flex,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiEye, FiPlus, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import ViewPaymentsModal from './ViewPaymentsModal';

// Static dummy data for sales
const dummySales = [
  {
    id: '1',
    propertyId: 'PROP001',
    propertyName: 'Luxury Villa in Beverly Hills',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1-555-0123',
    salePrice: 2500000,
    saleDate: '2024-03-15',
    status: 'completed',
    agentName: 'Sarah Johnson',
    commission: 75000,
    paymentStatus: 'paid',
    installmentPlan: 'lump-sum',
    totalInstallments: 1,
    paidInstallments: 1,
    nextPaymentDate: null,
    notes: 'Premium property with excellent location',
  },
  {
    id: '2',
    propertyId: 'PROP002',
    propertyName: 'Modern Apartment Downtown',
    customerName: 'Emily Davis',
    customerEmail: 'emily.davis@email.com',
    customerPhone: '+1-555-0456',
    salePrice: 850000,
    saleDate: '2024-03-10',
    status: 'pending',
    agentName: 'Mike Wilson',
    commission: 25500,
    paymentStatus: 'partial',
    installmentPlan: 'monthly',
    totalInstallments: 12,
    paidInstallments: 3,
    nextPaymentDate: '2024-04-10',
    notes: 'Young professional buyer, monthly payment plan',
  },
  {
    id: '3',
    propertyId: 'PROP003',
    propertyName: 'Family Home in Suburbs',
    customerName: 'Robert Brown',
    customerEmail: 'robert.brown@email.com',
    customerPhone: '+1-555-0789',
    salePrice: 1200000,
    saleDate: '2024-03-05',
    status: 'completed',
    agentName: 'Lisa Anderson',
    commission: 36000,
    paymentStatus: 'paid',
    installmentPlan: 'quarterly',
    totalInstallments: 4,
    paidInstallments: 4,
    nextPaymentDate: null,
    notes: 'Family with children, school district important',
  },
  {
    id: '4',
    propertyId: 'PROP004',
    propertyName: 'Investment Property Complex',
    customerName: 'Jennifer Lee',
    customerEmail: 'jennifer.lee@email.com',
    customerPhone: '+1-555-0321',
    salePrice: 3500000,
    saleDate: '2024-02-28',
    status: 'pending',
    agentName: 'David Chen',
    commission: 105000,
    paymentStatus: 'pending',
    installmentPlan: 'custom',
    totalInstallments: 8,
    paidInstallments: 0,
    nextPaymentDate: '2024-04-28',
    notes: 'Investment group, custom payment schedule',
  },
  {
    id: '5',
    propertyId: 'PROP005',
    propertyName: 'Beachfront Condo',
    customerName: 'Michael Taylor',
    customerEmail: 'michael.taylor@email.com',
    customerPhone: '+1-555-0654',
    salePrice: 1800000,
    saleDate: '2024-02-20',
    status: 'completed',
    agentName: 'Sarah Johnson',
    commission: 54000,
    paymentStatus: 'paid',
    installmentPlan: 'lump-sum',
    totalInstallments: 1,
    paidInstallments: 1,
    nextPaymentDate: null,
    notes: 'Retirement property, cash buyer',
  },
];

const SalesList = () => {
  const [sales, setSales] = useState(dummySales);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isViewPaymentsOpen, setIsViewPaymentsOpen] = useState(false);
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [formData, setFormData] = useState({
    propertyId: '',
    propertyName: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    salePrice: '',
    saleDate: '',
    status: '',
    agentName: '',
    commission: '',
    paymentStatus: '',
    installmentPlan: '',
    totalInstallments: '',
    notes: '',
  });
  const toast = useToast();

  // Calculate summary statistics
  const totalSales = sales.length;
  const completedSales = sales.filter(sale => sale.status === 'completed').length;
  const pendingSales = sales.filter(sale => sale.status === 'pending').length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
  const totalCommission = sales.reduce((sum, sale) => sum + sale.commission, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSale) {
      // Update existing sale
      setSales(sales.map(sale => 
        sale.id === selectedSale.id 
          ? { ...sale, ...formData, salePrice: parseFloat(formData.salePrice), commission: parseFloat(formData.commission) }
          : sale
      ));
      toast({
        title: 'Sale updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Add new sale
      const newSale = {
        id: Date.now().toString(),
        ...formData,
        salePrice: parseFloat(formData.salePrice),
        commission: parseFloat(formData.commission),
        paidInstallments: 0,
        nextPaymentDate: formData.installmentPlan === 'lump-sum' ? null : new Date().toISOString().split('T')[0],
      };
      setSales([...sales, newSale]);
      toast({
        title: 'Sale added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onFormClose();
  };

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setFormData({
      propertyId: sale.propertyId,
      propertyName: sale.propertyName,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      customerPhone: sale.customerPhone,
      salePrice: sale.salePrice.toString(),
      saleDate: sale.saleDate,
      status: sale.status,
      agentName: sale.agentName,
      commission: sale.commission.toString(),
      paymentStatus: sale.paymentStatus,
      installmentPlan: sale.installmentPlan,
      totalInstallments: sale.totalInstallments.toString(),
      notes: sale.notes,
    });
    onFormOpen();
  };

  const handleDelete = () => {
    setSales(sales.filter(sale => sale.id !== selectedSale.id));
    toast({
      title: 'Sale deleted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'partial': return 'orange';
      case 'pending': return 'red';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box p={6}>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="light.darkText">
          Sales Management
        </Text>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={() => {
            setSelectedSale(null);
            setFormData({
              propertyId: '',
              propertyName: '',
              customerName: '',
              customerEmail: '',
              customerPhone: '',
              salePrice: '',
              saleDate: '',
              status: '',
              agentName: '',
              commission: '',
              paymentStatus: '',
              installmentPlan: '',
              totalInstallments: '',
              notes: '',
            });
            onFormOpen();
          }}
        >
          Add Sale
        </Button>
      </HStack>

      {/* Summary Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Sales</StatLabel>
              <StatNumber>{totalSales}</StatNumber>
              <StatHelpText>
                <FiTrendingUp color="green" /> {completedSales} completed
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Revenue</StatLabel>
              <StatNumber>{formatCurrency(totalRevenue)}</StatNumber>
              <StatHelpText>
                <FiDollarSign /> All time
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Commission</StatLabel>
              <StatNumber>{formatCurrency(totalCommission)}</StatNumber>
              <StatHelpText>
                <FiDollarSign /> Agent earnings
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending Sales</StatLabel>
              <StatNumber>{pendingSales}</StatNumber>
              <StatHelpText>
                <FiTrendingDown color="orange" /> In progress
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Sales Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Property</Th>
              <Th>Customer</Th>
              <Th>Sale Price</Th>
              <Th>Status</Th>
              <Th>Payment Status</Th>
              <Th>Agent</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sales.map((sale) => (
              <Tr key={sale.id}>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{sale.propertyName}</Text>
                    <Text fontSize="sm" color="gray.500">{sale.propertyId}</Text>
                  </VStack>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{sale.customerName}</Text>
                    <Text fontSize="sm" color="gray.500">{sale.customerEmail}</Text>
                  </VStack>
                </Td>
                <Td>
                  <Text fontWeight="bold">{formatCurrency(sale.salePrice)}</Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(sale.status)}>
                    {sale.status}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={getPaymentStatusColor(sale.paymentStatus)}>
                    {sale.paymentStatus}
                  </Badge>
                </Td>
                <Td>{sale.agentName}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="View payments"
                      icon={<FiEye />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => {
                        setSelectedSale(sale);
                        setIsViewPaymentsOpen(true);
                      }}
                    />
                    <IconButton
                      aria-label="Edit sale"
                      icon={<FiEdit2 />}
                      size="sm"
                      colorScheme="brand"
                      variant="ghost"
                      onClick={() => handleEdit(sale)}
                    />
                    <IconButton
                      aria-label="Delete sale"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => {
                        setSelectedSale(sale);
                        onDeleteOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Add/Edit Sale Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedSale ? 'Edit Sale' : 'Add New Sale'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Property ID</FormLabel>
                    <Input
                      name="propertyId"
                      value={formData.propertyId}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Property Name</FormLabel>
                    <Input
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </HStack>
                
                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Customer Name</FormLabel>
                    <Input
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Customer Email</FormLabel>
                    <Input
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Customer Phone</FormLabel>
                    <Input
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Sale Price</FormLabel>
                    <Input
                      name="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Sale Date</FormLabel>
                    <Input
                      name="saleDate"
                      type="date"
                      value={formData.saleDate}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Agent Name</FormLabel>
                    <Input
                      name="agentName"
                      value={formData.agentName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Commission</FormLabel>
                    <Input
                      name="commission"
                      type="number"
                      value={formData.commission}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Payment Status</FormLabel>
                    <Select
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Payment Status</option>
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Installment Plan</FormLabel>
                    <Select
                      name="installmentPlan"
                      value={formData.installmentPlan}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Plan</option>
                      <option value="lump-sum">Lump Sum</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="custom">Custom</option>
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Total Installments</FormLabel>
                  <Input
                    name="totalInstallments"
                    type="number"
                    value={formData.totalInstallments}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFormClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleSubmit}>
              {selectedSale ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Sale</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete the sale for{' '}
              {selectedSale && selectedSale.propertyName}? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Payments Modal */}
      <ViewPaymentsModal
        isOpen={isViewPaymentsOpen}
        onClose={() => setIsViewPaymentsOpen(false)}
        sale={selectedSale}
      />
    </Box>
  );
};

export default SalesList; 