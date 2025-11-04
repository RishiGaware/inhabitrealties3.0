import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

const FormModal = ({ isOpen, onClose, title, children, onSave, onSubmit, isSubmitting, buttonLabel = 'Save', loadingText = 'Saving...', size = 'xl', maxW, closeOnOverlayClick = true, closeOnEsc = true }) => {
  // Use onSave if provided, otherwise fall back to onSubmit for backward compatibility
  const handleSubmit = onSave || onSubmit;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered closeOnOverlayClick={closeOnOverlayClick} closeOnEsc={closeOnEsc}>
      <ModalOverlay />
      <ModalContent 
        maxW={maxW || { base: "95vw", sm: "70vw", md: "70vw", lg: "70vw", xl: "70vw" }}
        maxH={{ base: "95vh", md: "auto" }}
        h={{ base: "95vh", md: "auto" }}
        overflow="hidden"
        mx={{ base: 1, md: 4 }}
        my={{ base: 1, md: 4 }}
        display="flex"
        flexDirection="column"
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <ModalBody 
            flex="1"
            overflowY="auto"
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
            minH={0}
            maxH="none"
          >
            {children}
          </ModalBody>
          <ModalFooter 
            flexShrink={0}
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            px={{ base: 4, md: 6 }}
            py={{ base: 3, md: 4 }}
          >
            <Button variant="ghost" mr={3} onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={isSubmitting}
              loadingText={loadingText}
            >
              {buttonLabel}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default FormModal; 