import React from 'react';
import {
  Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton,
  VStack, Box, HStack, Text as ChakraText
} from '@chakra-ui/react';
import { FiBell, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const getIconForType = (type) => {
  switch (type) {
    case 'info': return <FiInfo color="#3182ce" />;
    case 'success': return <FiCheckCircle color="#38a169" />;
    case 'warning': return <FiAlertTriangle color="#dd6b20" />;
    default: return <FiBell color="#718096" />;
  }
};

const NotificationDrawer = ({ isOpen, onClose, notifications = [] }) => (
  <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader borderBottomWidth="1px">Notifications</DrawerHeader>
      <DrawerBody p={0}>
        <VStack align="stretch" spacing={0} divider={<Box h="1px" bg="gray.100" />}> 
          {notifications.length > 0 ? notifications.map((n) => (
            <HStack key={n.id} align="flex-start" spacing={3} p={4} _hover={{ bg: 'gray.50' }}>
              <Box p={2} borderRadius="full" bg="gray.100">
                {getIconForType(n.type)}
              </Box>
              <Box flex={1} minW={0}>
                <ChakraText fontWeight="semibold" fontSize="sm" color="gray.800" noOfLines={1}>{n.title}</ChakraText>
                <ChakraText fontSize="xs" color="gray.600" noOfLines={2}>{n.description}</ChakraText>
                <ChakraText fontSize="2xs" color="gray.400" mt={1}>{n.timestamp}</ChakraText>
              </Box>
            </HStack>
          )) : (
            <Box p={6} textAlign="center" color="gray.400">
              <FiBell size={32} />
              <ChakraText mt={2} fontSize="sm">No new notifications</ChakraText>
            </Box>
          )}
        </VStack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default NotificationDrawer; 