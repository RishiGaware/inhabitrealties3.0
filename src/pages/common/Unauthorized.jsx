import React from 'react';
import { Box, VStack, Text, Button, Heading, Icon } from '@chakra-ui/react';
import { FaLock, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { getUserRoleName } = useAuth();
  const userRole = getUserRoleName() || 'USER';

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      p={4}
    >
      <VStack spacing={6} textAlign="center" maxW="md">
        <Icon as={FaLock} boxSize={20} color="red.500" />
        
        <VStack spacing={2}>
          <Heading as="h1" size="xl" color="red.600">
            Access Denied
          </Heading>
          <Text fontSize="lg" color="gray.600">
            You don't have permission to access this page.
          </Text>
          <Text fontSize="sm" color="gray.500">
            Your current role: <strong>{userRole}</strong>
          </Text>
        </VStack>

        <VStack spacing={3} w="full">
          <Button
            leftIcon={<FaHome />}
            colorScheme="blue"
            onClick={handleGoHome}
            w="full"
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoBack}
            w="full"
          >
            Go Back
          </Button>
        </VStack>

        <Text fontSize="xs" color="gray.400">
          If you believe this is an error, please contact your administrator.
        </Text>
      </VStack>
    </Box>
  );
};

export default Unauthorized;

