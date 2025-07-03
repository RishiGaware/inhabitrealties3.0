import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Select,
  useToast,
} from "@chakra-ui/react";
import { FiDownload, FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Dummy data for reports
const dummyMonthlyData = [
  { month: 'Jan', sales: 2500000, installments: 1800000, rent: 500000 },
  { month: 'Feb', sales: 3200000, installments: 2200000, rent: 550000 },
  { month: 'Mar', sales: 2800000, installments: 1900000, rent: 520000 },
  { month: 'Apr', sales: 4500000, installments: 3100000, rent: 600000 },
  { month: 'May', sales: 3800000, installments: 2600000, rent: 580000 },
  { month: 'Jun', sales: 5200000, installments: 3500000, rent: 650000 },
];

const dummySalesData = [
  { month: 'Jan', completed: 5, pending: 3, cancelled: 1 },
  { month: 'Feb', completed: 8, pending: 2, cancelled: 0 },
  { month: 'Mar', completed: 6, pending: 4, cancelled: 1 },
  { month: 'Apr', completed: 12, pending: 3, cancelled: 0 },
  { month: 'May', completed: 10, pending: 5, cancelled: 1 },
  { month: 'Jun', completed: 15, pending: 2, cancelled: 0 },
];

const SalesReports = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [monthlyData, setMonthlyData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadReportData();
  }, [selectedYear, selectedPeriod]);

  const loadReportData = () => {
    setLoading(true);
    try {
      // Using dummy data
      setMonthlyData(dummyMonthlyData);
      setSalesData(dummySalesData);
    } catch (error) {
      toast({
        title: "Error loading reports",
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

  // Calculate summary statistics
  const totalSalesRevenue = monthlyData.reduce((sum, item) => sum + item.sales, 0);
  const totalInstallments = monthlyData.reduce((sum, item) => sum + item.installments, 0);
  const totalRent = monthlyData.reduce((sum, item) => sum + item.rent, 0);
  const totalIncome = totalSalesRevenue + totalInstallments + totalRent;

  // Calculate growth percentages (comparing last 2 months)
  const getGrowthPercentage = (data, key) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  };

  const salesGrowth = getGrowthPercentage(monthlyData, 'sales');
  const installmentsGrowth = getGrowthPercentage(monthlyData, 'installments');
  const rentGrowth = getGrowthPercentage(monthlyData, 'rent');

  const handleExport = async (format) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Export successful",
        description: `Report exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={3} border="1px" borderColor="gray.200" borderRadius="md" shadow="lg">
          <Text fontWeight="bold" mb={2}>{label}</Text>
          {payload.map((entry, index) => (
            <Text key={index} color={entry.color} fontSize="sm">
              {entry.name}: {formatCurrency(entry.value)}
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="light.darkText">
          Sales Reports
        </Text>
        <HStack spacing={4}>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            maxW="150px"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            maxW="150px"
          >
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="year">This Year</option>
          </Select>
          <Button
            leftIcon={<FiDownload />}
            onClick={() => handleExport('pdf')}
            variant="outline"
            colorScheme="brand"
          >
            Export PDF
          </Button>
          <Button
            leftIcon={<FiDownload />}
            onClick={() => handleExport('csv')}
            variant="outline"
            colorScheme="brand"
          >
            Export CSV
          </Button>
        </HStack>
      </HStack>

      {/* Summary Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel color="blue.600">Total Sales Revenue</StatLabel>
              <StatNumber color="blue.700">{formatCurrency(totalSalesRevenue)}</StatNumber>
              <StatHelpText>
                <HStack spacing={1}>
                  {salesGrowth >= 0 ? (
                    <FiTrendingUp color="green" />
                  ) : (
                    <FiTrendingDown color="red" />
                  )}
                  <Text color={salesGrowth >= 0 ? "green.500" : "red.500"}>
                    {Math.abs(salesGrowth).toFixed(1)}% from last month
                  </Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel color="green.600">Installment Collections</StatLabel>
              <StatNumber color="green.700">{formatCurrency(totalInstallments)}</StatNumber>
              <StatHelpText>
                <HStack spacing={1}>
                  {installmentsGrowth >= 0 ? (
                    <FiTrendingUp color="green" />
                  ) : (
                    <FiTrendingDown color="red" />
                  )}
                  <Text color={installmentsGrowth >= 0 ? "green.500" : "red.500"}>
                    {Math.abs(installmentsGrowth).toFixed(1)}% from last month
                  </Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel color="purple.600">Rent Collections</StatLabel>
              <StatNumber color="purple.700">{formatCurrency(totalRent)}</StatNumber>
              <StatHelpText>
                <HStack spacing={1}>
                  {rentGrowth >= 0 ? (
                    <FiTrendingUp color="green" />
                  ) : (
                    <FiTrendingDown color="red" />
                  )}
                  <Text color={rentGrowth >= 0 ? "green.500" : "red.500"}>
                    {Math.abs(rentGrowth).toFixed(1)}% from last month
                  </Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel color="orange.600">Total Income</StatLabel>
              <StatNumber color="orange.700">{formatCurrency(totalIncome)}</StatNumber>
              <StatHelpText>
                <HStack spacing={1}>
                  <FiDollarSign />
                  <Text>Combined revenue</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid templateColumns="repeat(auto-fit, minmax(500px, 1fr))" gap={6}>
        {/* Monthly Income Chart */}
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Monthly Income Trend
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="sales" stroke="#3182ce" name="Sales" strokeWidth={2} />
                <Line type="monotone" dataKey="installments" stroke="#38a169" name="Installments" strokeWidth={2} />
                <Line type="monotone" dataKey="rent" stroke="#805ad5" name="Rent" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Sales Status Chart */}
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Sales Status Overview
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#38a169" name="Completed" />
                <Bar dataKey="pending" fill="#d69e2e" name="Pending" />
                <Bar dataKey="cancelled" fill="#e53e3e" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </Grid>

      {/* Additional Statistics */}
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} mt={8}>
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Top Performing Properties
            </Text>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text>Sunset Villa</Text>
                <Text fontWeight="semibold">{formatCurrency(2500000)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Ocean View Apartment</Text>
                <Text fontWeight="semibold">{formatCurrency(1800000)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Garden Heights</Text>
                <Text fontWeight="semibold">{formatCurrency(3200000)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>City Center Plaza</Text>
                <Text fontWeight="semibold">{formatCurrency(4200000)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Luxury Penthouse</Text>
                <Text fontWeight="semibold">{formatCurrency(5500000)}</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Payment Methods Distribution
            </Text>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text>Bank Transfer</Text>
                <Text fontWeight="semibold">45%</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Cheque</Text>
                <Text fontWeight="semibold">30%</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Online Payment</Text>
                <Text fontWeight="semibold">15%</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Cash</Text>
                <Text fontWeight="semibold">10%</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
};

export default SalesReports; 