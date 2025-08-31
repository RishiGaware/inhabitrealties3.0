import React, { useState, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  Progress,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { FiUpload, FiX, FiFile, FiDownload, FiEye } from 'react-icons/fi';

const DocumentUpload = ({
  files = [],
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['pdf'], // Default to PDF only
  documentTypes = ['ID_PROOF', 'ADDRESS_PROOF', 'INCOME_PROOF', 'PROPERTY_DOCUMENTS', 'AGREEMENT_DOCUMENTS', 'OTHER'],
  isDisabled = false,
  title = "Document Upload",
  description = "Upload supporting documents for this booking"
}) => {
  const [dragActive, setDragActive] = useState(false);
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    
    // Validate file count
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate and process each file
    const validFiles = newFiles.map(file => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const isValidType = allowedTypes.includes(fileExtension);
      const isValidSize = file.size <= maxFileSize;

      if (!isValidType) {
        alert(`Only PDF files are allowed. File type ${fileExtension} is not supported.`);
        return null;
      }

      if (!isValidSize) {
        alert(`File ${file.name} is too large. Maximum size: ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB`);
        return null;
      }

      return {
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        documentType: 'OTHER',
        status: 'pending',
        progress: 0
      };
    }).filter(Boolean);

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const updateDocumentType = (fileId, documentType) => {
    const updatedFiles = files.map(f => 
      f.id === fileId ? { ...f, documentType } : f
    );
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    return '📄'; // Always PDF icon since only PDFs are allowed
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="semibold" fontSize="lg" mb={2}>
            {title}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Max {maxFiles} files, {formatFileSize(maxFileSize)} each. Allowed: {allowedTypes.join(', ')}
          </Text>
        </Box>

        {/* Drag & Drop Area */}
        <Box
          border="2px dashed"
          borderColor={dragActive ? 'blue.400' : borderColor}
          borderRadius="lg"
          p={6}
          textAlign="center"
          bg={dragActive ? 'blue.50' : bgColor}
          transition="all 0.2s"
          _hover={{ bg: hoverBgColor }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          cursor="pointer"
          onClick={() => document.getElementById('file-input').click()}
        >
          <VStack spacing={3}>
            <FiUpload size={24} color={dragActive ? '#3182ce' : '#718096'} />
            <Text fontWeight="medium">
              {dragActive ? 'Drop files here' : 'Drag & drop files here or click to browse'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {files.length}/{maxFiles} files selected
            </Text>
          </VStack>
        </Box>

        {/* Hidden file input */}
        <Input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={isDisabled}
        />

        {/* File List */}
        {files.length > 0 && (
          <VStack spacing={3} align="stretch">
            <Text fontWeight="medium" fontSize="sm">
              Selected Files ({files.length}/{maxFiles})
            </Text>
            
            {files.map((file) => (
              <Box
                key={file.id}
                p={3}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
              >
                <HStack justify="space-between" align="start">
                  <HStack spacing={3} align="start" flex={1}>
                    <Text fontSize="2xl">{getFileIcon()}</Text>
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                        {file.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatFileSize(file.size)}
                      </Text>
                      
                      {/* Document Type Selection */}
                      <FormControl size="sm">
                        <FormLabel fontSize="xs" mb={1}>Document Type</FormLabel>
                        <Select
                          size="sm"
                          value={file.documentType}
                          onChange={(e) => updateDocumentType(file.id, e.target.value)}
                          isDisabled={isDisabled}
                        >
                          {documentTypes.map(type => (
                            <option key={type} value={type}>
                              {type.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Upload Progress */}
                      {file.status === 'uploading' && (
                        <Progress 
                          value={file.progress} 
                          size="sm" 
                          width="100%" 
                          colorScheme="blue"
                        />
                      )}
                    </VStack>
                  </HStack>
                  
                  <HStack spacing={2}>
                    {file.status === 'uploaded' && (
                      <>
                        <IconButton
                          size="sm"
                          icon={<FiEye />}
                          aria-label="View document"
                          variant="ghost"
                          colorScheme="blue"
                        />
                        <IconButton
                          size="sm"
                          icon={<FiDownload />}
                          aria-label="Download document"
                          variant="ghost"
                          colorScheme="green"
                        />
                      </>
                    )}
                    <IconButton
                      size="sm"
                      icon={<FiX />}
                      aria-label="Remove file"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeFile(file.id)}
                      isDisabled={isDisabled}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        {/* Status Messages */}
        {files.length === 0 && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">No documents selected</AlertTitle>
              <AlertDescription fontSize="xs">
                Upload PDF documents like ID proof, address proof, income proof, property documents, or agreements. Only PDF files are accepted.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {files.length >= maxFiles && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <AlertTitle fontSize="sm">Maximum files reached</AlertTitle>
            <AlertDescription fontSize="xs">
              You can upload up to {maxFiles} documents. Remove some files to add more.
            </AlertDescription>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default DocumentUpload; 