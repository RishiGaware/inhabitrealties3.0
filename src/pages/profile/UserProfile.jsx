import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  Button,
  IconButton,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Switch,
  Badge,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Spinner,
  Image,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiCamera,
  FiTrash2,
  FiSave,
  FiX,
  FiCheck,
  FiUpload,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiShield,
  FiStar,
  FiAward,
  FiActivity,
  FiTrendingUp,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useUserProfilePictureContext } from '../../context/UserProfilePictureContext';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Loader from '../../components/common/Loader';
import CommonCard from '../../components/common/Card/CommonCard';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionAvatar = motion(Avatar);

const UserProfile = () => {
  const { getUser, getUserId } = useAuth();
  const user = getUser(); // Get the user object from auth context
  const {
    currentUserProfilePicture,
    loading: profilePictureLoading,
    getUserProfilePictureById,
    addUserProfilePicture,
    updateUserProfilePictureById,
    removeUserProfilePicture,
  } = useUserProfilePictureContext();

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: '',
    isPublic: false,
  });

  const fileInputRef = useRef();
  const { isOpen: isUploadModalOpen, onOpen: onUploadModalOpen, onClose: onUploadModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        bio: user.bio || '',
        isPublic: user.isPublic || false,
      });
    }
  }, [user]);

  // Fetch user's profile picture on component mount
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      getUserProfilePictureById(userId);
    }
  }, [getUserId, getUserProfilePictureById]);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showErrorToast('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
      onUploadModalOpen();
    }
  };

  // Handle profile picture upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('profile', selectedFile);
      formData.append('userId', getUserId());

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      if (currentUserProfilePicture) {
        // Update existing profile picture
        await updateUserProfilePictureById(currentUserProfilePicture._id, formData);
      } else {
        // Create new profile picture
        await addUserProfilePicture(formData);
      }

      setUploadProgress(100);
      setTimeout(() => {
        onUploadModalClose();
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsUploading(false);
        setUploadProgress(0);
        showSuccessToast('Profile picture updated successfully!');
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      showErrorToast('Failed to upload profile picture');
    }
  };

  // Handle profile picture deletion
  const handleDeleteProfilePicture = async () => {
    if (!currentUserProfilePicture) return;

    try {
      await removeUserProfilePicture(currentUserProfilePicture._id);
      onDeleteModalClose();
      showSuccessToast('Profile picture deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      showErrorToast('Failed to delete profile picture');
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically update the user profile via API
    showSuccessToast('Profile updated successfully!');
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (currentUserProfilePicture?.displayUrl) {
      return currentUserProfilePicture.displayUrl;
    }
    if (currentUserProfilePicture?.mediumUrl) {
      return currentUserProfilePicture.mediumUrl;
    }
    if (currentUserProfilePicture?.thumbnailUrl) {
      return currentUserProfilePicture.thumbnailUrl;
    }
    return null;
  };

  const profilePictureUrl = getProfilePictureUrl();

  return (
    <Box p={{ base: 2, sm: 3, md: 6 }} minH="100vh" bg="gray.50">
      {profilePictureLoading && <Loader size="xl" />}
      
      <AnimatePresence>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <MotionCard
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            mb={{ base: 4, md: 6 }}
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="xl"
          >
            <CardBody p={{ base: 4, md: 8 }}>
              <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={{ base: 4, md: 6 }}>
                {/* Profile Picture Section */}
                <Box position="relative" mb={{ base: 4, md: 0 }} alignSelf={{ base: 'center', md: 'flex-start' }}>
                  <MotionAvatar
                    size={{ base: 'xl', sm: '2xl' }}
                    boxSize={{ base: '90px', sm: '120px', md: '150px' }}
                    src={profilePictureUrl}
                    name={`${user?.firstName} ${user?.lastName}`}
                    bg="white"
                    color="gray.700"
                    border="4px solid white"
                    boxShadow="lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Upload Button Overlay */}
                  <Tooltip label="Change Profile Picture" hasArrow>
                    <IconButton
                      icon={<FiCamera />}
                      size="sm"
                      colorScheme="whiteAlpha"
                      position="absolute"
                      bottom={2}
                      right={2}
                      onClick={() => fileInputRef.current?.click()}
                      _hover={{ bg: 'whiteAlpha.300' }}
                      aria-label="Change Profile Picture"
                    />
                  </Tooltip>

                  {/* Delete Button */}
                  {currentUserProfilePicture && (
                    <Tooltip label="Delete Profile Picture" hasArrow>
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="solid"
                        position="absolute"
                        top={2}
                        right={2}
                        onClick={onDeleteModalOpen}
                        _hover={{ bg: 'red.600' }}
                        aria-label="Delete Profile Picture"
                      />
                    </Tooltip>
                  )}
                </Box>

                {/* User Info */}
                <VStack flex={1} align={{ base: 'center', md: 'flex-start' }} spacing={2} mb={{ base: 4, md: 0 }}>
                  <Heading size={{ base: 'md', sm: 'lg' }} textAlign={{ base: 'center', md: 'left' }}>
                    {user?.firstName} {user?.lastName}
                  </Heading>
                  <Text
                    fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                    color="white"
                    bg="rgba(80,36,143,0.18)"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontWeight="medium"
                    letterSpacing="wide"
                    textShadow="0 1px 4px rgba(80,36,143,0.18)"
                    boxShadow="0 1px 4px rgba(80,36,143,0.10)"
                    display="inline-block"
                    mt={1}
                  >
                    {user?.email}
                  </Text>
                  <HStack spacing={2} flexWrap="wrap" justify={{ base: 'center', md: 'flex-start' }}>
                    <Badge colorScheme="green" borderRadius="full" px={3} fontSize={{ base: 'xs', sm: 'sm' }}>
                      Active
                    </Badge>
                    <Badge colorScheme="blue" borderRadius="full" px={3} fontSize={{ base: 'xs', sm: 'sm' }}>
                      {user?.role || 'User'}
                    </Badge>
                  </HStack>
                </VStack>

                {/* Action Buttons */}
                <VStack spacing={3} w={{ base: '100%', md: 'auto' }}>
                  <Button
                    leftIcon={<FiEdit2 />}
                    colorScheme="whiteAlpha"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    _hover={{ bg: 'whiteAlpha.200' }}
                    w={{ base: '100%', sm: 'auto' }}
                    fontSize={{ base: 'sm', sm: 'md' }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    leftIcon={<FiUpload />}
                    colorScheme="whiteAlpha"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    _hover={{ bg: 'whiteAlpha.200' }}
                    w={{ base: '100%', sm: 'auto' }}
                    fontSize={{ base: 'sm', sm: 'md' }}
                  >
                    Upload Photo
                  </Button>
                </VStack>
              </Flex>
            </CardBody>
          </MotionCard>

          {/* Stats Section */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            mb={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="md"
          >
            <CardBody>
              <Grid templateColumns={{ base: '1fr 1fr', sm: 'repeat(4, 1fr)' }} gap={{ base: 3, md: 6 }}>
                <Stat>
                  <StatLabel color="gray.600">Total Leads</StatLabel>
                  <StatNumber color="brand.600">24</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    12.5%
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel color="gray.600">Properties</StatLabel>
                  <StatNumber color="green.600">8</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    8.2%
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel color="gray.600">Sales</StatLabel>
                  <StatNumber color="purple.600">₹2.4M</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    15.3%
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel color="gray.600">Rating</StatLabel>
                  <StatNumber color="orange.600">4.8</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    0.2%
                  </StatHelpText>
                </Stat>
              </Grid>
            </CardBody>
          </MotionCard>

          {/* Profile Details Section */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={{ base: 4, md: 6 }} alignItems="flex-start">
            {/* Main Profile Form */}
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              borderRadius="xl"
              boxShadow="md"
              bg="white"
              w="full"
              p={0}
            >
              <CardHeader pb={0}>
                <Heading size={{ base: 'sm', md: 'md' }} color="gray.700">
                  Personal Information
                </Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleFormSubmit}>
                  <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                    <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 4 }}>
                      <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          isDisabled={!isEditing}
                          placeholder="Enter first name"
                          fontSize={{ base: 'sm', md: 'md' }}
                          bg={{ base: 'gray.50', md: 'white' }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          isDisabled={!isEditing}
                          placeholder="Enter last name"
                          fontSize={{ base: 'sm', md: 'md' }}
                          bg={{ base: 'gray.50', md: 'white' }}
                        />
                      </FormControl>
                    </Flex>

                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isDisabled={!isEditing}
                        placeholder="Enter email"
                        type="email"
                        fontSize={{ base: 'sm', md: 'md' }}
                        bg={{ base: 'gray.50', md: 'white' }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        isDisabled={!isEditing}
                        placeholder="Enter phone number"
                        fontSize={{ base: 'sm', md: 'md' }}
                        bg={{ base: 'gray.50', md: 'white' }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Address</FormLabel>
                      <Textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        isDisabled={!isEditing}
                        placeholder="Enter address"
                        rows={3}
                        fontSize={{ base: 'sm', md: 'md' }}
                        bg={{ base: 'gray.50', md: 'white' }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Bio</FormLabel>
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        isDisabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        fontSize={{ base: 'sm', md: 'md' }}
                        bg={{ base: 'gray.50', md: 'white' }}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">Public Profile</FormLabel>
                      <Switch
                        name="isPublic"
                        isChecked={formData.isPublic}
                        onChange={handleInputChange}
                        isDisabled={!isEditing}
                        colorScheme="brand"
                        size={{ base: 'sm', md: 'md' }}
                      />
                    </FormControl>

                    {isEditing && (
                      <HStack spacing={4} w="full" justify="flex-end" mt={2}>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          leftIcon={<FiX />}
                          w={{ base: '50%', md: 'auto' }}
                          fontSize={{ base: 'sm', md: 'md' }}
                        >
                          Cancel
                        </Button>
                        <Button
                          colorScheme="brand"
                          type="submit"
                          leftIcon={<FiSave />}
                          w={{ base: '50%', md: 'auto' }}
                          fontSize={{ base: 'sm', md: 'md' }}
                        >
                          Save Changes
                        </Button>
                      </HStack>
                    )}
                  </VStack>
                </form>
              </CardBody>
            </MotionCard>

            {/* Sidebar */}
            <VStack spacing={{ base: 4, md: 6 }} w="full">
              {/* Profile Picture Info */}
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                borderRadius="xl"
                boxShadow="md"
                w="full"
                bg="white"
                p={0}
              >
                <CardHeader pb={0}>
                  <Heading size={{ base: 'sm', md: 'md' }} color="gray.700">
                    Profile Picture
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <Avatar
                      size={{ base: 'md', md: 'lg' }}
                      src={profilePictureUrl}
                      name={`${user?.firstName} ${user?.lastName}`}
                    />
                    {currentUserProfilePicture ? (
                      <VStack spacing={2} align="start" w="full">
                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                          File: {currentUserProfilePicture.fileName}
                        </Text>
                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                          Size: {(currentUserProfilePicture.size / 1024 / 1024).toFixed(2)} MB
                        </Text>
                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                          Uploaded: {new Date(currentUserProfilePicture.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                    ) : (
                      <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" textAlign="center">
                        No profile picture uploaded
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Account Status */}
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                borderRadius="xl"
                boxShadow="md"
                w="full"
                bg="white"
                p={0}
              >
                <CardHeader pb={0}>
                  <Heading size={{ base: 'sm', md: 'md' }} color="gray.700">
                    Account Status
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="start">
                    <HStack>
                      <FiShield color="green" />
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>Account Verified</Text>
                    </HStack>
                    <HStack>
                      <FiActivity color="blue" />
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>Last Active: Today</Text>
                    </HStack>
                    <HStack>
                      <FiCalendar color="purple" />
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>Member since: {new Date().getFullYear()}</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            </VStack>
          </Grid>
        </MotionBox>
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={onUploadModalClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Upload Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {previewUrl && (
                <Box>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    borderRadius="lg"
                    maxH="200px"
                    mx="auto"
                  />
                </Box>
              )}
              {isUploading && (
                <Box w="full">
                  <Progress value={uploadProgress} colorScheme="brand" borderRadius="full" />
                  <Text fontSize="sm" color="gray.600" mt={2} textAlign="center">
                    Uploading... {uploadProgress}%
                  </Text>
                </Box>
              )}
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {selectedFile?.name}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onUploadModalClose} isDisabled={isUploading}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleUpload}
              isLoading={isUploading}
              loadingText="Uploading"
              leftIcon={<FiUpload />}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Delete Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Are you sure?</AlertTitle>
                <AlertDescription>
                  This action cannot be undone. Your profile picture will be permanently deleted.
                </AlertDescription>
              </Box>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteProfilePicture}
              leftIcon={<FiTrash2 />}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserProfile; 