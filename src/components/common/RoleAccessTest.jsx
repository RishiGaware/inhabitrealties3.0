import React from 'react';
import { Box, VStack, Text, Badge, Heading, Divider } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { hasMenuAccess, hasSubMenuAccess, getAllowedMenus, getAllowedSubMenus } from '../../utils/rolePermissions';

/**
 * Role Access Test Component
 * Shows current user role and access permissions
 * Can be temporarily added to any page for testing
 */
const RoleAccessTest = () => {
  const { getUserRoleName, getUserRoleDetails } = useAuth();
  const userRole = getUserRoleName() || 'USER';
  const roleDetails = getUserRoleDetails();

  const testMenus = [
    'dashboard',
    'user-dashboard',
    'admin',
    'documentManagement',
    'property',
    'displayProperties',
    'leads',
    'customers',
    'scheduleMeetings',
    'purchaseBookings',
    'rentalBookings',
    'payments',
    'client',
    'settings'
  ];

  const testSubMenus = {
    documentManagement: ['document-type-management', 'document-management', 'my-documents'],
    displayProperties: ['properties', 'favorite'],
    scheduleMeetings: ['admin-meetings', 'sales-meetings', 'my-meetings'],
    purchaseBookings: ['all-purchase-bookings', 'my-assigned-bookings', 'my-bookings', 'create-new-purchase'],
    rentalBookings: ['all-rental-bookings', 'my-assigned-rentals', 'my-bookings', 'create-new-rental'],
    payments: ['all-payment-history', 'assigned-payment-history', 'my-payment-history'],
    client: ['my-bookings', 'my-meetings', 'payments']
  };

  return (
    <Box p={4} border="1px solid" borderColor="gray.300" borderRadius="md" bg="gray.50">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Role Access Test</Heading>
        
        <VStack spacing={2} align="start">
          <Text fontWeight="bold">Current User Role:</Text>
          <Badge colorScheme="blue" fontSize="sm" p={2}>
            {userRole}
          </Badge>
          {roleDetails && (
            <Text fontSize="sm" color="gray.600">
              Description: {roleDetails.description}
            </Text>
          )}
        </VStack>

        <Divider />

        <VStack spacing={2} align="stretch">
          <Text fontWeight="bold">Menu Access:</Text>
          {testMenus.map(menu => {
            const hasAccess = hasMenuAccess(userRole, menu);
            return (
              <Box key={menu} display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="sm">{menu}</Text>
                <Badge colorScheme={hasAccess ? "green" : "red"} fontSize="xs">
                  {hasAccess ? "ALLOWED" : "DENIED"}
                </Badge>
              </Box>
            );
          })}
        </VStack>

        <Divider />

        <VStack spacing={2} align="stretch">
          <Text fontWeight="bold">SubMenu Access:</Text>
          {Object.entries(testSubMenus).map(([menu, subMenus]) => (
            <Box key={menu}>
              <Text fontSize="sm" fontWeight="semibold" mb={1}>{menu}:</Text>
              {subMenus.map(subMenu => {
                const hasAccess = hasSubMenuAccess(userRole, menu, subMenu);
                return (
                  <Box key={subMenu} display="flex" justifyContent="space-between" alignItems="center" ml={4}>
                    <Text fontSize="xs">{subMenu}</Text>
                    <Badge colorScheme={hasAccess ? "green" : "red"} fontSize="xs">
                      {hasAccess ? "ALLOWED" : "DENIED"}
                    </Badge>
                  </Box>
                );
              })}
            </Box>
          ))}
        </VStack>

        <Divider />

        <VStack spacing={2} align="stretch">
          <Text fontWeight="bold">Allowed Menus for {userRole}:</Text>
          <Text fontSize="sm" color="gray.600">
            {getAllowedMenus(userRole).join(', ')}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default RoleAccessTest;







