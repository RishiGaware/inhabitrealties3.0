import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Text, VStack, HStack, Badge, Avatar } from '@chakra-ui/react';

const UserInfo = () => {
  const { 
    auth, 
    isAuthenticated, 
    getMessage, 
    getUserId, 
    getUserEmail, 
    getUserName, 
    getUserRole, 
    isAdmin 
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Box p={4} bg="gray.100" borderRadius="md">
        <Text>Not logged in</Text>
      </Box>
    );
  }

  return (
    <Box p={4} bg="white" borderRadius="md" shadow="sm">
      <VStack spacing={3} align="start">
        <HStack spacing={3}>
          <Avatar size="sm" name={getUserName()} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{getUserName()}</Text>
            <Text fontSize="sm" color="gray.600">{getUserEmail()}</Text>
          </VStack>
        </HStack>
        
        <HStack spacing={2}>
          <Badge colorScheme={isAdmin() ? "red" : "blue"}>
            {isAdmin() ? "Admin" : "User"}
          </Badge>
          <Badge colorScheme="green">Active</Badge>
        </HStack>

        <VStack align="start" spacing={1} fontSize="xs" color="gray.500">
          <Text>User ID: {getUserId()}</Text>
          <Text>Role ID: {getUserRole()}</Text>
          <Text>Session: {getMessage()}</Text>
        </VStack>

        {/* Example of accessing the complete auth object */}
        <Box mt={2} p={2} bg="gray.50" borderRadius="sm" fontSize="xs">
          <Text fontWeight="bold">Complete Auth Object:</Text>
          <Text fontFamily="mono" fontSize="xs">
            {JSON.stringify(auth, null, 2)}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default UserInfo; 