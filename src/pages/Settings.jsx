import React, { useState, useEffect } from 'react';
import { Box, Heading, Flex, Button, Text, Grid, useDisclosure, useToast } from '@chakra-ui/react';
import { FaUser, FaBell, FaShieldAlt, FaPalette, FaCog, FaSave, FaSignOutAlt } from 'react-icons/fa';
import Loader from '../components/common/Loader';
import CommonCard from '../components/common/Card/CommonCard';
import FloatingInput from '../components/common/floatingInput/FloatingInput';
import FormModal from '../components/common/FormModal';
import LogoutButton from '../components/common/LogoutButton';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const { isOpen: isPasswordModalOpen, onOpen: onPasswordModalOpen, onClose: onPasswordModalClose } = useDisclosure();
  const toast = useToast();
  
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      avatar: null
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      leadAlerts: true,
      paymentReminders: true,
      systemUpdates: false
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAlerts: true
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Simulate API call
    const fetchSettings = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Settings are already initialized above
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async (section) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Saving ${section} settings:`, settings[section]);
      
      toast({
        title: 'Settings saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Handle password change logic here
    console.log('Changing password:', passwordData);
    toast({
      title: 'Password changed successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onPasswordModalClose();
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'preferences', label: 'Preferences', icon: <FaPalette /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> }
  ];

  if (loading) {
    return <Loader fullScreen text="Loading settings..." />;
  }

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          Settings
        </Heading>
        <LogoutButton />
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '250px 1fr' }} gap={6}>
        {/* Sidebar */}
        <CommonCard p={4}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Settings</Text>
            <Box space={2}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? 'solid' : 'ghost'}
                  colorScheme={activeTab === tab.id ? 'brand' : 'gray'}
                  leftIcon={tab.icon}
                  width="full"
                  justifyContent="flex-start"
                  mb={2}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>
        </CommonCard>

        {/* Content */}
        <CommonCard p={6}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Box>
              <Heading size="md" mb={6}>Profile Information</Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={6}>
                <FloatingInput
                  name="firstName"
                  label="First Name"
                  value={settings.profile.firstName}
                  onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                />
                <FloatingInput
                  name="lastName"
                  label="Last Name"
                  value={settings.profile.lastName}
                  onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                />
                <FloatingInput
                  name="email"
                  label="Email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                />
                <FloatingInput
                  name="phone"
                  label="Phone"
                  value={settings.profile.phone}
                  onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                />
              </Grid>
              <Button
                leftIcon={<FaSave />}
                colorScheme="brand"
                onClick={() => handleSave('profile')}
              >
                Save Profile
              </Button>
            </Box>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Box>
              <Heading size="md" mb={6}>Notification Preferences</Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={6}>
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <Box key={key} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="medium" mb={1}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Text>
                      </Box>
                      <Button
                        size="sm"
                        colorScheme={value ? 'green' : 'gray'}
                        variant={value ? 'solid' : 'outline'}
                        onClick={() => handleSettingChange('notifications', key, !value)}
                      >
                        {value ? 'On' : 'Off'}
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Grid>
              <Button
                leftIcon={<FaSave />}
                colorScheme="brand"
                onClick={() => handleSave('notifications')}
              >
                Save Notifications
              </Button>
            </Box>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Box>
              <Heading size="md" mb={6}>Preferences</Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={6}>
                <FloatingInput
                  name="theme"
                  label="Theme"
                  value={settings.preferences.theme}
                  onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                />
                <FloatingInput
                  name="language"
                  label="Language"
                  value={settings.preferences.language}
                  onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                />
                <FloatingInput
                  name="timezone"
                  label="Timezone"
                  value={settings.preferences.timezone}
                  onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                />
                <FloatingInput
                  name="currency"
                  label="Currency"
                  value={settings.preferences.currency}
                  onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                />
              </Grid>
              <Button
                leftIcon={<FaSave />}
                colorScheme="brand"
                onClick={() => handleSave('preferences')}
              >
                Save Preferences
              </Button>
            </Box>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Box>
              <Heading size="md" mb={6}>Security Settings</Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={6}>
                <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="medium" mb={1}>Two-Factor Authentication</Text>
                      <Text fontSize="sm" color="gray.600">Add an extra layer of security</Text>
                    </Box>
                    <Button
                      size="sm"
                      colorScheme={settings.security.twoFactorAuth ? 'green' : 'gray'}
                      variant={settings.security.twoFactorAuth ? 'solid' : 'outline'}
                      onClick={() => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                    >
                      {settings.security.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </Button>
                  </Flex>
                </Box>
                
                <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="medium" mb={1}>Login Alerts</Text>
                      <Text fontSize="sm" color="gray.600">Get notified of new logins</Text>
                    </Box>
                    <Button
                      size="sm"
                      colorScheme={settings.security.loginAlerts ? 'green' : 'gray'}
                      variant={settings.security.loginAlerts ? 'solid' : 'outline'}
                      onClick={() => handleSettingChange('security', 'loginAlerts', !settings.security.loginAlerts)}
                    >
                      {settings.security.loginAlerts ? 'On' : 'Off'}
                    </Button>
                  </Flex>
                </Box>
              </Grid>
              
              <Button
                leftIcon={<FaShieldAlt />}
                colorScheme="brand"
                onClick={onPasswordModalOpen}
                mb={4}
              >
                Change Password
              </Button>
              
              <Button
                leftIcon={<FaSave />}
                colorScheme="brand"
                onClick={() => handleSave('security')}
              >
                Save Security Settings
              </Button>
            </Box>
          )}
        </CommonCard>
      </Grid>

      {/* Password Change Modal */}
      <FormModal
        isOpen={isPasswordModalOpen}
        onClose={onPasswordModalClose}
        title="Change Password"
        onSave={handlePasswordChange}
      >
        <Box space={4}>
          <FloatingInput
            name="currentPassword"
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            required
          />
          <FloatingInput
            name="newPassword"
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            required
          />
          <FloatingInput
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            required
          />
        </Box>
      </FormModal>
    </Box>
  );
};

export default Settings; 