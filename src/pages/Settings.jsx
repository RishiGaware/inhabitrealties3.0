import React, { useState, useEffect } from 'react';
import { Box, Heading, Flex, Button, Text, Grid, useToast, VStack, HStack, Badge, Divider, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { FaUser, FaCog, FaSave, FaSignOutAlt, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import CommonCard from '../components/common/Card/CommonCard';
import FloatingInput from '../components/common/floatingInput/FloatingInput';
import LogoutButton from '../components/common/LogoutButton';
import { editUser } from '../services/usermanagement/userService';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    createdAt: '',
    updatedAt: ''
  });

  const [originalUserData, setOriginalUserData] = useState({});

  // System information state
  const [systemInfo, setSystemInfo] = useState({
    version: '1.0.0',
    buildDate: '2024-01-15',
    environment: 'Production',
    lastUpdate: '2024-01-15',
    uptime: '15 days',
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0
  });



  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get user data from localStorage
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          if (parsedAuth.data) {
            setUserData(parsedAuth.data);
            setOriginalUserData(parsedAuth.data);
          }
        }


        // Load system information (in a real app, this would come from an API)
        setSystemInfo(prev => ({
          ...prev,
          uptime: `${Math.floor(Math.random() * 30) + 1} days`,
          totalUsers: Math.floor(Math.random() * 1000) + 100,
          totalProperties: Math.floor(Math.random() * 500) + 50,
          totalBookings: Math.floor(Math.random() * 200) + 25
        }));

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error loading user data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update user data via API
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber
      };

      const response = await editUser(userData._id, updateData);
      
      // Update localStorage with new data
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        parsedAuth.data = { ...parsedAuth.data, ...response.data };
        localStorage.setItem('auth', JSON.stringify(parsedAuth));
      }

      setOriginalUserData(userData);
      setIsEditing(false);
      
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error saving profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };


  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    // { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'system', label: 'System Settings', icon: <FaCog />, adminOnly: true }
  ];

  if (loading) {
    return <Loader fullScreen text="Loading settings..." />;
  }

  return (
    <Box p={{ base: 3, sm: 4, md: 5 }} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 3, sm: 0 }}>
        <Heading as="h1" variant="pageTitle" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} textAlign={{ base: 'center', sm: 'left' }}>
          Settings
        </Heading>
        <LogoutButton />
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '280px 1fr' }} gap={{ base: 3, md: 6 }}>
        {/* Sidebar */}
        <CommonCard p={{ base: 2, sm: 3, md: 4 }}>
          <Box>
            <Text fontSize={{ base: 'sm', sm: 'md', md: 'lg' }} fontWeight="bold" mb={{ base: 2, sm: 3, md: 4 }}>Settings</Text>
            <VStack spacing={{ base: 1, sm: 2 }} align="stretch">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? 'solid' : 'ghost'}
                  colorScheme={activeTab === tab.id ? 'brand' : 'gray'}
                  leftIcon={tab.icon}
                  width="full"
                  justifyContent="flex-start"
                  size={{ base: 'xs', sm: 'sm', md: 'md' }}
                  fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                  px={{ base: 1, sm: 2, md: 4 }}
                  py={{ base: 1, sm: 2, md: 3 }}
                  minH={{ base: '32px', sm: '36px', md: '40px' }}
                >
                  {tab.label}
                </Button>
              ))}
            </VStack>
          </Box>
        </CommonCard>

        {/* Content */}
        <CommonCard p={{ base: 3, sm: 4, md: 6 }}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Box>
              <Flex justify="space-between" align="center" mb={{ base: 3, md: 6 }} direction={{ base: 'column', sm: 'row' }} gap={{ base: 2, sm: 0 }}>
                <Heading size={{ base: 'xs', sm: 'sm', md: 'md' }}>Profile Information</Heading>
                {!isEditing ? (
                  <Button
                    leftIcon={<FaEdit />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={handleEdit}
                    size={{ base: 'xs', sm: 'sm', md: 'md' }}
                    fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                    px={{ base: 2, sm: 3, md: 4 }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <HStack spacing={{ base: 1, sm: 2 }} flexWrap="wrap" justify={{ base: 'center', sm: 'flex-end' }}>
                    <Button
                      leftIcon={<FaTimes />}
                      colorScheme="red"
                      variant="outline"
                      onClick={handleCancel}
                      size={{ base: 'xs', sm: 'sm', md: 'md' }}
                      fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                      px={{ base: 2, sm: 3, md: 4 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      leftIcon={<FaCheck />}
                      colorScheme="green"
                      onClick={handleSave}
                      isLoading={saving}
                      loadingText="Saving..."
                      size={{ base: 'xs', sm: 'sm', md: 'md' }}
                      fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                      px={{ base: 2, sm: 3, md: 4 }}
                    >
                      Save Changes
                    </Button>
                  </HStack>
                )}
              </Flex>

              {/* User Info Display */}
              <VStack spacing={{ base: 2, md: 4 }} align="stretch" mb={{ base: 3, md: 6 }}>
                <CommonCard p={{ base: 2, sm: 3, md: 4 }}>
                  <VStack spacing={{ base: 2, md: 4 }} align="stretch">
                    <HStack justify="space-between" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>User ID:</Text>
                      <Text fontFamily="mono" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} wordBreak="break-all">{userData._id}</Text>
                    </HStack>
                    <HStack justify="space-between" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>Role:</Text>
                      <Badge colorScheme="blue" variant="subtle" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>
                        {userData.role === '68162f63ff2da55b40ca61b8' ? 'ADMIN' : 'USER'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>Created:</Text>
                      <Text fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>Last Updated:</Text>
                      <Text fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>
                        {userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'N/A'}
                      </Text>
                    </HStack>
                  </VStack>
                </CommonCard>
              </VStack>

              {/* Editable Fields */}
              <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap={{ base: 2, sm: 3, md: 4 }} mb={{ base: 3, md: 6 }}>
                <FloatingInput
                  name="firstName"
                  label="First Name"
                  value={userData.firstName}
                  onChange={(e) => handleUserDataChange('firstName', e.target.value)}
                  isDisabled={!isEditing}
                />
                <FloatingInput
                  name="lastName"
                  label="Last Name"
                  value={userData.lastName}
                  onChange={(e) => handleUserDataChange('lastName', e.target.value)}
                  isDisabled={!isEditing}
                />
                <FloatingInput
                  name="email"
                  label="Email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleUserDataChange('email', e.target.value)}
                  isDisabled={!isEditing}
                />
                <FloatingInput
                  name="phoneNumber"
                  label="Phone Number"
                  value={userData.phoneNumber}
                  onChange={(e) => handleUserDataChange('phoneNumber', e.target.value)}
                  isDisabled={!isEditing}
                />
              </Grid>

              {/* Session Info */}
              <Alert status="info" borderRadius="md" mb={{ base: 2, md: 4 }} p={{ base: 2, md: 3 }}>
                <AlertIcon />
            <Box>
                  <AlertTitle fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Session Information</AlertTitle>
                  <AlertDescription fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>
                    Your session will expire in 24 hours. Please save your work before the session ends.
                  </AlertDescription>
                      </Box>
              </Alert>
            </Box>
          )}





          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <Box>
              <Heading size={{ base: 'xs', sm: 'sm', md: 'md' }} mb={{ base: 3, md: 6 }}>System Settings</Heading>
              <Text color="gray.600" mb={{ base: 3, md: 6 }} fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>Configure system-wide settings and preferences</Text>
              
              {/* System Information */}
              <CommonCard p={{ base: 2, sm: 3, md: 6 }} mb={{ base: 3, md: 6 }}>
                <VStack spacing={{ base: 2, md: 4 }} align="stretch">
                  <Heading size={{ base: 'xs', sm: 'sm', md: 'md' }} color="blue.700">System Information</Heading>
                  <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap={{ base: 2, sm: 3, md: 4 }}>
                    <HStack justify="space-between" p={{ base: 1, sm: 2, md: 3 }} bg="blue.50" borderRadius="md" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Version:</Text>
                      <Text fontFamily="mono" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} color="blue.600">{systemInfo.version}</Text>
                    </HStack>
                    <HStack justify="space-between" p={{ base: 1, sm: 2, md: 3 }} bg="green.50" borderRadius="md" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Environment:</Text>
                      <Badge colorScheme="green" variant="subtle" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>{systemInfo.environment}</Badge>
                    </HStack>
                    <HStack justify="space-between" p={{ base: 1, sm: 2, md: 3 }} bg="purple.50" borderRadius="md" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Build Date:</Text>
                      <Text fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>{systemInfo.buildDate}</Text>
                    </HStack>
                    <HStack justify="space-between" p={{ base: 1, sm: 2, md: 3 }} bg="orange.50" borderRadius="md" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Uptime:</Text>
                      <Text fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} color="orange.600">{systemInfo.uptime}</Text>
                    </HStack>
                    <HStack justify="space-between" p={{ base: 1, sm: 2, md: 3 }} bg="teal.50" borderRadius="md" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Total Users:</Text>
                      <Text fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} fontWeight="bold" color="teal.600">{systemInfo.totalUsers}</Text>
                    </HStack>
                    <HStack justify="space-between" p={{ base: 1, sm: 2, md: 3 }} bg="cyan.50" borderRadius="md" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Total Properties:</Text>
                      <Text fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} fontWeight="bold" color="cyan.600">{systemInfo.totalProperties}</Text>
                    </HStack>
                    <HStack justify="space-between" p={{ base: 1, sm: 2, md: 3 }} bg="pink.50" borderRadius="md" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Total Bookings:</Text>
                      <Text fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} fontWeight="bold" color="pink.600">{systemInfo.totalBookings}</Text>
                    </HStack>
                    <HStack justify="space-between" p={{ base: 1, sm: 2, md: 3 }} bg="gray.50" borderRadius="md" flexWrap="wrap" gap={1}>
                      <Text fontWeight="semibold" color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Last Update:</Text>
                      <Text fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>{systemInfo.lastUpdate}</Text>
                    </HStack>
              </Grid>
                </VStack>
              </CommonCard>

              <VStack spacing={{ base: 2, md: 4 }} align="stretch">
                {/* Property Types */}
                <CommonCard p={{ base: 2, sm: 3, md: 4 }}>
                  <HStack justify="space-between" align="center" flexWrap="wrap" gap={{ base: 2, md: 4 }}>
                    <Box>
                      <Text fontWeight="semibold" fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }}>Property Types</Text>
                      <Text color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Manage property categories and types</Text>
                    </Box>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => navigate('/property/property-types')}
                      size={{ base: 'xs', sm: 'sm', md: 'md' }}
                      fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}
                      px={{ base: 2, sm: 3, md: 4 }}
                    >
                      Manage Property Types
                    </Button>
                  </HStack>
                </CommonCard>
                
                {/* Lead Status Management */}
                <CommonCard p={{ base: 2, sm: 3, md: 4 }}>
                  <HStack justify="space-between" align="center" flexWrap="wrap" gap={{ base: 2, md: 4 }}>
                    <Box>
                      <Text fontWeight="semibold" fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }}>Lead Status Management</Text>
                      <Text color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Configure lead statuses and workflows</Text>
                    </Box>
                    <Button
                      colorScheme="green"
                      variant="outline"
                      onClick={() => navigate('/lead/view')}
                      size={{ base: 'xs', sm: 'sm', md: 'md' }}
                      fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}
                      px={{ base: 2, sm: 3, md: 4 }}
                    >
                      Manage Lead Statuses
                    </Button>
                  </HStack>
                </CommonCard>

                {/* Follow-up Status Management */}
                <CommonCard p={{ base: 2, sm: 3, md: 4 }}>
                  <HStack justify="space-between" align="center" flexWrap="wrap" gap={{ base: 2, md: 4 }}>
                    <Box>
                      <Text fontWeight="semibold" fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }}>Follow-up Status Management</Text>
                      <Text color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Configure follow-up statuses and tracking</Text>
                </Box>
              <Button
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => navigate('/lead/qualification')}
                      size={{ base: 'xs', sm: 'sm', md: 'md' }}
                      fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}
                      px={{ base: 2, sm: 3, md: 4 }}
                    >
                      Manage Follow-up Statuses
              </Button>
                  </HStack>
                </CommonCard>

                {/* Reference Source Management */}
                <CommonCard p={{ base: 2, sm: 3, md: 4 }}>
                  <HStack justify="space-between" align="center" flexWrap="wrap" gap={{ base: 2, md: 4 }}>
                    <Box>
                      <Text fontWeight="semibold" fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }}>Reference Source Management</Text>
                      <Text color="gray.600" fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}>Manage lead sources and referral channels</Text>
                    </Box>
              <Button
                      colorScheme="orange"
                      variant="outline"
                      onClick={() => navigate('/lead/reference-source')}
                      size={{ base: 'xs', sm: 'sm', md: 'md' }}
                      fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}
                      px={{ base: 2, sm: 3, md: 4 }}
                    >
                      Manage Reference Sources
              </Button>
                  </HStack>
                </CommonCard>

              </VStack>
            </Box>
          )}
        </CommonCard>
      </Grid>

    </Box>
  );
};

export default Settings; 