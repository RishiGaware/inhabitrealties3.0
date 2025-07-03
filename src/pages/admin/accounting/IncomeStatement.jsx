import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Select,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  Icon,
  Spinner,
  Center,
  Divider,
} from "@chakra-ui/react";
import { FiCalendar, FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// Placeholder for API call
const fetchIncomeStatementData = async (period) => {
  console.log(`Fetching income statement data for period: ${period}`);
  // In a real app, you would fetch data based on the period.
  // This would involve aggregating data from sales, rent, expenses, etc.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        revenue: {
          propertySales: 150000,
          rentalIncome: 25000,
          otherIncome: 2500,
        },
        expenses: {
          maintenance: 15000,
          marketing: 5000,
          utilities: 8000,
          commissions: 45000,
          taxes: 22000,
          other: 3000,
        },
        chartData: [
            { name: 'Jan', revenue: 40000, expenses: 24000, profit: 16000 },
            { name: 'Feb', revenue: 30000, expenses: 13980, profit: 16020 },
            { name: 'Mar', revenue: 50000, expenses: 38000, profit: 12000 },
            { name: 'Apr', revenue: 47800, expenses: 39080, profit: 8720 },
            { name: 'May', revenue: 58900, expenses: 48000, profit: 10900 },
            { name: 'Jun', revenue: 63900, expenses: 38000, profit: 25900 },
          ]
      });
    }, 1000);
  });
};

const IncomeStatement = () => {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("quarterly");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const result = await fetchIncomeStatementData(period);
      setData(result);
      setIsLoading(false);
    };
    getData();
  }, [period]);

  const totalRevenue = data ? Object.values(data.revenue).reduce((a, b) => a + b, 0) : 0;
  const totalExpenses = data ? Object.values(data.expenses).reduce((a, b) => a + b, 0) : 0;
  const netProfit = totalRevenue - totalExpenses;

  const DataRow = ({ label, value, isTotal = false, isPositive = false }) => (
    <Flex justify="space-between" py={2}>
      <Text fontWeight={isTotal ? "bold" : "normal"}>{label}</Text>
      <Text fontWeight={isTotal ? "bold" : "normal"} color={isTotal ? (isPositive ? 'green.500' : 'red.500') : 'inherit'}>
        ${value.toLocaleString()}
      </Text>
    </Flex>
  );

  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.primary" />
          <Text>Generating Income Statement...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
        <Flex direction={{base: "column", md: "row"}} justify="space-between" align="center" mb={6}>
            <VStack align={{base: 'center', md: 'start'}}>
                <Heading as="h1" size="lg">Income Statement</Heading>
                <Text color="gray.500">Review your company's financial performance.</Text>
            </VStack>
            <FormControl maxW="200px" mt={{base: 4, md: 0}}>
                <HStack>
                    <Icon as={FiCalendar} />
                    <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option value="monthly">This Month</option>
                        <option value="quarterly">This Quarter</option>
                        <option value="yearly">This Year</option>
                    </Select>
                </HStack>
            </FormControl>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={6}>
        <Card bg="green.50" variant="outline">
            <CardBody>
                <HStack>
                    <Icon as={FiTrendingUp} w={8} h={8} color="green.500" />
                    <Box>
                        <Text>Total Revenue</Text>
                        <Text fontSize="2xl" fontWeight="bold">${totalRevenue.toLocaleString()}</Text>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
        <Card bg="red.50" variant="outline">
            <CardBody>
                <HStack>
                    <Icon as={FiTrendingDown} w={8} h={8} color="red.500" />
                    <Box>
                        <Text>Total Expenses</Text>
                        <Text fontSize="2xl" fontWeight="bold">${totalExpenses.toLocaleString()}</Text>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
        <Card bg={netProfit > 0 ? 'blue.50' : 'orange.50'} variant="outline">
            <CardBody>
                <HStack>
                    <Icon as={FiDollarSign} w={8} h={8} color={netProfit > 0 ? 'blue.500' : 'orange.500'}/>
                    <Box>
                        <Text>Net Profit</Text>
                        <Text fontSize="2xl" fontWeight="bold" color={netProfit > 0 ? 'blue.600' : 'orange.600'}>${netProfit.toLocaleString()}</Text>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardHeader><Heading size="md">Financial Summary</Heading></CardHeader>
          <CardBody>
            <VStack divider={<Divider />} spacing={4} align="stretch">
                <Box>
                    <Heading size="sm" mb={2} color="green.600">Revenue</Heading>
                    {data && Object.entries(data.revenue).map(([key, value]) => (
                        <DataRow key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} value={value} />
                    ))}
                    <DataRow label="Total Revenue" value={totalRevenue} isTotal />
                </Box>
                <Box>
                    <Heading size="sm" mb={2} color="red.600">Expenses</Heading>
                    {data && Object.entries(data.expenses).map(([key, value]) => (
                        <DataRow key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} value={value} />
                    ))}
                    <DataRow label="Total Expenses" value={totalExpenses} isTotal />
                </Box>
                <Box>
                    <DataRow label="Net Profit" value={netProfit} isTotal isPositive={netProfit > 0} />
                </Box>
            </VStack>
          </CardBody>
        </Card>
        <Card>
            <CardHeader><Heading size="md">Performance Over Time</Heading></CardHeader>
            <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data?.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#48BB78" />
                        <Bar dataKey="expenses" fill="#F56565" />
                        <Bar dataKey="profit" fill="#4299E1" />
                    </BarChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default IncomeStatement; 