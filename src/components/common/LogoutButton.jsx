import React from 'react';
import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaSignOutAlt, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const LogoutButton = ({ variant = 'ghost', size = 'md', ...props }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Show success message
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Close the dialog
    onClose();
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <>
      <Button
        leftIcon={<FaSignOutAlt />}
        onClick={onOpen}
        variant={variant}
        size={size}
        colorScheme="red"
        _hover={{
          bg: 'red.50',
          color: 'red.600',
        }}
        transition="all 0.2s"
        {...props}
      >
        Logout
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <AlertDialogContent
          mx={4}
          bg={bgColor}
          borderRadius="xl"
          boxShadow="xl"
          border="1px"
          borderColor={borderColor}
          maxW="400px"
        >
          <AlertDialogHeader pb={4}>
            <HStack spacing={3}>
              <Box
                p={2}
                bg="red.100"
                borderRadius="full"
                color="red.600"
              >
                <Icon as={FaExclamationTriangle} boxSize={5} />
              </Box>
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  Confirm Logout
                </Text>
                <Text fontSize="sm" color={mutedTextColor}>
                  Are you sure you want to logout?
                </Text>
              </VStack>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody pb={6}>
            <Text fontSize="sm" color={mutedTextColor}>
              You will be signed out of your account and redirected to the login page.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <HStack spacing={3} w="full">
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="outline"
                flex={1}
                size="md"
                borderRadius="lg"
                _hover={{
                  bg: 'gray.50',
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleLogout}
                flex={1}
                leftIcon={<FaSignOutAlt />}
                size="md"
                borderRadius="lg"
                _hover={{
                  bg: 'red.600',
                }}
              >
                Logout
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutButton; 