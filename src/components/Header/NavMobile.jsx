import { IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack, Button, useDisclosure, Box, Text, Divider, HStack } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { FiHome, FiInfo, FiMail, FiLogIn, FiUserPlus } from 'react-icons/fi';
import logo from '../../assets/images/logo.png';

const NavMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'About Us', path: '/about', icon: FiInfo },
    { name: 'Contact Us', path: '/contact', icon: FiMail },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label='Open Menu'
        icon={<FaBars />}
        variant='ghost'
        onClick={onOpen}
        color="purple.600"
        fontSize="24px"
      />
      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size="sm">
        <DrawerOverlay bg="blackAlpha.400" />
        <DrawerContent bg="white" boxShadow="2xl">
          <DrawerHeader borderBottomWidth='1px' borderColor="gray.100" p={6}>
            <HStack justify="space-between">
              <HStack spacing={4}>
                <img src={logo} alt="Inhabit Realties" style={{ height: '40px' }} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Inhabit Realties
                  </Text>
                  <Text fontSize="xs" color="gray.500" style={{ fontFamily: "'Inter', sans-serif" }}>
                    WE PRESENT YOUR DREAMS
                  </Text>
                </VStack>
              </HStack>
              <DrawerCloseButton position="static" color="gray.500" />
            </HStack>
          </DrawerHeader>
          <DrawerBody p={6}>
            <VStack spacing={4} align='stretch' mt={4}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  variant={location.pathname === item.path ? 'solid' : 'ghost'}
                  colorScheme={location.pathname === item.path ? 'purple' : 'gray'}
                  color={location.pathname === item.path ? 'white' : 'gray.700'}
                  bg={location.pathname === item.path ? 'purple.600' : 'transparent'}
                  justifyContent='flex-start'
                  leftIcon={<item.icon />}
                  py={6}
                  px={4}
                  borderRadius="lg"
                  fontWeight="semibold"
                  fontSize="md"
                  _hover={{
                    bg: location.pathname === item.path ? 'purple.700' : 'purple.50',
                    color: location.pathname === item.path ? 'white' : 'purple.700',
                  }}
                  transition="all 0.2s"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.name}
                </Button>
              ))}
              
              <Divider my={4} />

              <Button
                onClick={() => handleNavigate('/login')}
                variant='outline'
                colorScheme="purple"
                justifyContent='flex-start'
                leftIcon={<FiLogIn />}
                py={6}
                px={4}
                borderRadius="lg"
                fontWeight="semibold"
                fontSize="md"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleNavigate('/register')}
                variant='solid'
                colorScheme="purple"
                bg="purple.600"
                color="white"
                justifyContent='flex-start'
                leftIcon={<FiUserPlus />}
                py={6}
                px={4}
                borderRadius="lg"
                fontWeight="semibold"
                fontSize="md"
                _hover={{ bg: 'purple.700' }}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Create Account
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NavMobile;