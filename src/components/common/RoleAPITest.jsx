import React, { useState } from 'react';
import { Button, VStack, HStack, Text, Box, Input, useToast } from '@chakra-ui/react';
import { createRole, editRole, deleteRole, fetchRoles } from '../../services/rolemanagement/roleService';

const RoleAPITest = () => {
  const [testData, setTestData] = useState({
    name: 'TEST_ROLE',
    description: 'Test role for debugging'
  });
  const [roleId, setRoleId] = useState('');
  const [results, setResults] = useState([]);
  const toast = useToast();

  const addResult = (operation, result, error = null) => {
    const newResult = {
      id: Date.now(),
      operation,
      result: error ? 'ERROR' : 'SUCCESS',
      data: error ? error.message : result,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [newResult, ...prev.slice(0, 9)]);
  };

  const testCreateRole = async () => {
    try {
      console.log('Testing create role with data:', testData);
      const response = await createRole(testData);
      console.log('Create role response:', response);
      addResult('CREATE', response);
      toast({
        title: 'Create Role Success',
        description: JSON.stringify(response, null, 2),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Create role error:', error);
      addResult('CREATE', null, error);
      toast({
        title: 'Create Role Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const testEditRole = async () => {
    if (!roleId) {
      toast({
        title: 'Error',
        description: 'Please enter a role ID',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('Testing edit role with ID:', roleId);
      const response = await editRole(roleId, testData);
      console.log('Edit role response:', response);
      addResult('EDIT', response);
      toast({
        title: 'Edit Role Success',
        description: JSON.stringify(response, null, 2),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Edit role error:', error);
      addResult('EDIT', null, error);
      toast({
        title: 'Edit Role Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const testFetchRoles = async () => {
    try {
      console.log('Testing fetch roles');
      const response = await fetchRoles();
      console.log('Fetch roles response:', response);
      addResult('FETCH', response);
      toast({
        title: 'Fetch Roles Success',
        description: `Found ${response.data?.length || 0} roles`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Fetch roles error:', error);
      addResult('FETCH', null, error);
      toast({
        title: 'Fetch Roles Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const testDeleteRole = async () => {
    if (!roleId) {
      toast({
        title: 'Error',
        description: 'Please enter a role ID',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('Testing delete role with ID:', roleId);
      const response = await deleteRole(roleId);
      console.log('Delete role response:', response);
      addResult('DELETE', response);
      toast({
        title: 'Delete Role Success',
        description: JSON.stringify(response, null, 2),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Delete role error:', error);
      addResult('DELETE', null, error);
      toast({
        title: 'Delete Role Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="md" mb={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Role API Test Component
      </Text>
      
      <VStack spacing={4} align="stretch">
        <HStack>
          <Input
            placeholder="Role Name"
            value={testData.name}
            onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Description"
            value={testData.description}
            onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
          />
          <Input
            placeholder="Role ID (for edit/delete)"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          />
        </HStack>
        
        <HStack spacing={2}>
          <Button colorScheme="green" onClick={testCreateRole}>
            Test Create
          </Button>
          <Button colorScheme="blue" onClick={testEditRole}>
            Test Edit
          </Button>
          <Button colorScheme="purple" onClick={testFetchRoles}>
            Test Fetch
          </Button>
          <Button colorScheme="red" onClick={testDeleteRole}>
            Test Delete
          </Button>
        </HStack>
        
        <Box>
          <Text fontWeight="bold" mb={2}>Test Results:</Text>
          <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
            {results.map((result) => (
              <Box
                key={result.id}
                p={2}
                bg={result.result === 'SUCCESS' ? 'green.50' : 'red.50'}
                border="1px solid"
                borderColor={result.result === 'SUCCESS' ? 'green.200' : 'red.200'}
                borderRadius="md"
              >
                <Text fontSize="sm" fontWeight="bold">
                  {result.operation} - {result.result} ({result.timestamp})
                </Text>
                <Text fontSize="xs" fontFamily="mono">
                  {JSON.stringify(result.data, null, 2)}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default RoleAPITest; 