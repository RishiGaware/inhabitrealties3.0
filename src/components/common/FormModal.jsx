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

const FormModal = ({ isOpen, onClose, title, children, onSave, onSubmit, isSubmitting, buttonLabel = 'Save', loadingText = 'Saving...' }) => {
  // Use onSave if provided, otherwise fall back to onSubmit for backward compatibility
  const handleSubmit = onSave || onSubmit;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
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