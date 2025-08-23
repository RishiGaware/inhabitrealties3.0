import React from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  Badge,
  HStack,
  Select,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { FiTrash2, FiEdit, FiCheck, FiX } from 'react-icons/fi';

const BulkActions = ({
  selectedItems = [],
  onBulkUpdate,
  onBulkDelete,
  updateOptions = [],
  totalItems = 0,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleBulkUpdate = async () => {
    if (!selectedStatus) {
      toast({
        title: "Status required",
        description: "Please select a status to update",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUpdating(true);
    try {
      await onBulkUpdate(selectedItems, { status: selectedStatus });
      toast({
        title: "Bulk update successful",
        description: `${selectedItems.length} items updated successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedStatus('');
    } catch (error) {
      toast({
        title: "Bulk update failed",
        description: error.message || "An error occurred during bulk update",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await onBulkDelete(selectedItems);
      toast({
        title: "Bulk delete successful",
        description: `${selectedItems.length} items deleted successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Bulk delete failed",
        description: error.message || "An error occurred during bulk delete",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <Box
      bg="blue.50"
      border="1px solid"
      borderColor="blue.200"
      borderRadius="lg"
      p={4}
      mb={4}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        <HStack spacing={3}>
          <Badge colorScheme="blue" variant="solid" fontSize="sm">
            {selectedItems.length} selected
          </Badge>
          <Text fontSize="sm" color="gray.600">
            of {totalItems} total items
          </Text>
        </HStack>

        <HStack spacing={3} wrap="wrap">
          {/* Bulk Status Update */}
          {updateOptions.length > 0 && (
            <HStack spacing={2}>
              <Select
                size="sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                placeholder="Select status"
                minW="150px"
              >
                {updateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<FiCheck />}
                onClick={handleBulkUpdate}
                isLoading={isUpdating}
                loadingText="Updating..."
                isDisabled={!selectedStatus}
              >
                Update Status
              </Button>
            </HStack>
          )}

          {/* Bulk Delete */}
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            leftIcon={<FiTrash2 />}
            onClick={onOpen}
            isLoading={isDeleting}
            loadingText="Deleting..."
          >
            Delete Selected
          </Button>

          {/* Clear Selection */}
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<FiX />}
            onClick={() => window.location.reload()}
          >
            Clear Selection
          </Button>
        </HStack>
      </Flex>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Selected Items
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {selectedItems.length} selected item(s)? 
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleBulkDelete}
                ml={3}
                isLoading={isDeleting}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default BulkActions; 