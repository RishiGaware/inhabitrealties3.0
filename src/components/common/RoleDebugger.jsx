import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Text, Code, Divider } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { printRoleInfo, getUserRole, getUserRoleDetails, getUserRoleName } from '../../utils/roleUtils';

/**
 * Role Debugger Component
 * This component helps debug role storage and access
 * Can be temporarily added to any page for testing
 */
const RoleDebugger = () => {
  const { getUserRole: getRoleFromContext, getUserRoleDetails: getRoleDetailsFromContext } = useAuth();
  const [roleInfo, setRoleInfo] = useState({});

  const refreshRoleInfo = () => {
    const info = {
      roleFromStorage: getUserRole(),
      roleDetailsFromStorage: getUserRoleDetails(),
      roleNameFromStorage: getUserRoleName(),
      roleFromContext: getRoleFromContext(),
      roleDetailsFromContext: getRoleDetailsFromContext(),
      localStorageAuth: localStorage.getItem('auth'),
      localStorageRole: localStorage.getItem('userRole'),
      localStorageRoleDetails: localStorage.getItem('userRoleDetails'),
    };
    setRoleInfo(info);
    console.log('Role Info Refreshed:', info);
  };

  useEffect(() => {
    refreshRoleInfo();
  }, []);

  return (
    <Box p={4} border="1px solid" borderColor="gray.300" borderRadius="md" bg="gray.50">
      <VStack spacing={3} align="stretch">
        <Text fontWeight="bold" fontSize="lg">Role Debugger</Text>
        
        <Button onClick={refreshRoleInfo} colorScheme="blue" size="sm">
          Refresh Role Info
        </Button>
        
        <Button onClick={printRoleInfo} colorScheme="green" size="sm">
          Print to Console
        </Button>
        
        <Divider />
        
        <VStack spacing={2} align="stretch">
          <Text fontWeight="semibold">Role from localStorage:</Text>
          <Code p={2} bg="white" borderRadius="md">
            {roleInfo.roleFromStorage || 'null'}
          </Code>
          
          <Text fontWeight="semibold">Role Name from localStorage:</Text>
          <Code p={2} bg="white" borderRadius="md">
            {roleInfo.roleNameFromStorage || 'null'}
          </Code>
          
          <Text fontWeight="semibold">Role from Context:</Text>
          <Code p={2} bg="white" borderRadius="md">
            {roleInfo.roleFromContext || 'null'}
          </Code>
          
          <Text fontWeight="semibold">Role Details from localStorage:</Text>
          <Code p={2} bg="white" borderRadius="md" maxH="200px" overflow="auto">
            {JSON.stringify(roleInfo.roleDetailsFromStorage, null, 2)}
          </Code>
        </VStack>
      </VStack>
    </Box>
  );
};

export default RoleDebugger;

