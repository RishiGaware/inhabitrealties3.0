import React from 'react';
import { Box, Icon, Text, VStack, Input } from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';

const DocumentUpload = ({ 
  onFileSelect, 
  acceptedTypes = ".pdf,.jpg,.jpeg,.png", 
  maxSize = 5, // in MB
  label = "Upload Document" 
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size should not exceed ${maxSize}MB`);
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <Box
      border="2px dashed"
      borderColor="gray.300"
      borderRadius="lg"
      p={6}
      cursor="pointer"
      _hover={{ borderColor: 'blue.500' }}
      position="relative"
    >
      <Input
        type="file"
        height="100%"
        width="100%"
        position="absolute"
        top="0"
        left="0"
        opacity="0"
        aria-hidden="true"
        accept={acceptedTypes}
        onChange={handleFileChange}
        cursor="pointer"
      />
      <VStack spacing={2}>
        <Icon as={FiUpload} w={6} h={6} color="gray.400" />
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {label}
        </Text>
        <Text fontSize="xs" color="gray.400">
          Max size: {maxSize}MB
        </Text>
      </VStack>
    </Box>
  );
};

export default DocumentUpload; 