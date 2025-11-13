import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Text, Badge, VStack, HStack } from '@chakra-ui/react';

const UserRoleInfo = () => {
  const { 
    getUserRoleDetails, 
    getUserRoleName, 
    getUserRoleDescription,
    getUserName,
    getUserEmail 
  } = useAuth();

  const roleDetails = getUserRoleDetails();
  const roleName = getUserRoleName();
  const roleDescription = getUserRoleDescription();
  const userName = getUserName();
  const userEmail = getUserEmail();

  if (!roleDetails) {
    return (
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="sm" color="gray.600">
          Role information not available
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4} bg="white" borderRadius="md" border="1px" borderColor="gray.200">
      <VStack spacing={3} align="start">
        <HStack spacing={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            User:
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            {userName}
          </Text>
        </HStack>
        
        <HStack spacing={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Email:
          </Text>
          <Text fontSize="sm">
            {userEmail}
          </Text>
        </HStack>
        
        <HStack spacing={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Role:
          </Text>
          <Badge colorScheme="blue" fontSize="xs">
            {roleName}
          </Badge>
        </HStack>
        
        {roleDescription && (
          <HStack spacing={2} align="start">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Description:
            </Text>
            <Text fontSize="sm" color="gray.700">
              {roleDescription}
            </Text>
          </HStack>
        )}
        
        <HStack spacing={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Role ID:
          </Text>
          <Text fontSize="xs" fontFamily="mono" color="gray.500">
            {roleDetails._id}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default UserRoleInfo;








