import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';
import SearchableSelect from '../../components/common/SearchableSelect';

const LeadFormModal = ({
  isOpen,
  onClose,
  onSave,
  isEditMode = false,
  initialData = {},
  userOptions = [],
  propertyOptions = [],
  leadStatusOptions = [],
  followUpStatusOptions = [],
  referenceSources = [],
  ...modalProps
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    propertyId: '',
    leadStatusId: '',
    followUpStatusId: '',
    referanceFromId: '',
    assignedToUserId: '',
    note: '',
  });
  const [referenceType, setReferenceType] = useState('internal');
  const [referanceFromExternalName, setReferanceFromExternalName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        propertyId: initialData.propertyId || '',
        leadStatusId: initialData.leadStatusId || '',
        followUpStatusId: initialData.followUpStatusId || '',
        referanceFromId: initialData.referanceFromId || '',
        assignedToUserId: initialData.assignedToUserId || '',
        note: initialData.note || '',
      });
      if (initialData.referanceFromExternalName) {
        setReferenceType('external');
        setReferanceFromExternalName(initialData.referanceFromExternalName);
      } else {
        setReferenceType('internal');
        setReferanceFromExternalName('');
      }
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        propertyId: '',
        leadStatusId: '',
        followUpStatusId: '',
        referanceFromId: '',
        assignedToUserId: '',
        note: '',
      });
      setReferenceType('internal');
      setReferanceFromExternalName('');
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    else if (!/^[A-Za-z]+$/.test(formData.firstName)) newErrors.firstName = 'First name must contain only letters.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    else if (!/^[A-Za-z]+$/.test(formData.lastName)) newErrors.lastName = 'Last name must contain only letters.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is not valid.';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required.';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits.';
    if (!formData.leadStatusId) newErrors.leadStatusId = 'Lead status is required.';
    if (!formData.followUpStatusId) newErrors.followUpStatusId = 'Follow up status is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = () => {
    validate();
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Reference From options: users + sources
  const referenceFromOptions = [
    ...userOptions.map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u._id })),
    ...referenceSources.map(s => ({ label: s.name, value: s._id }))
  ];
  // Fallback for current value if not in options
  const referenceFromFallback = formData.referanceFromId &&
    !referenceFromOptions.some(opt => opt.value === formData.referanceFromId)
    ? [{ label: initialData?.referanceFrom?.name || 'Current Reference', value: formData.referanceFromId }]
    : [];

  // For Assigned To fallback
  const assignedUserOption = formData.assignedToUserId &&
    !userOptions.some(u => u._id === formData.assignedToUserId)
    ? [{
        label: initialData?.assignedToUserId?.firstName
          ? `${initialData.assignedToUserId.firstName} ${initialData.assignedToUserId.lastName} (${initialData.assignedToUserId.email})`
          : 'Current User',
        value: formData.assignedToUserId
      }]
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      referenceType,
      referanceFromExternalName,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? 'Edit Lead' : 'Add New Lead'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Flex gap={4}>
                <FormControl isRequired isInvalid={!!errors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input name="firstName" value={formData.firstName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Enter first name" autoComplete="off" />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input name="lastName" value={formData.lastName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Enter last name" autoComplete="off" />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>
              </Flex>
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} placeholder="Enter email address" autoComplete="off" />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} onBlur={handleBlur} placeholder="Enter 10-digit phone number" autoComplete="off" maxLength={10} />
                <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Interested Property</FormLabel>
                <SearchableSelect
                  options={propertyOptions}
                  value={formData.propertyId}
                  onChange={val => handleSelectChange('propertyId', val)}
                  placeholder="Select property (optional)"
                />
              </FormControl>
              <FormControl isInvalid={!!errors.leadStatusId} isRequired>
                <FormLabel>Lead Status</FormLabel>
                <SearchableSelect
                  options={leadStatusOptions.map(s => ({ label: s.name, value: s._id }))}
                  value={formData.leadStatusId}
                  onChange={val => handleSelectChange('leadStatusId', val)}
                  placeholder="Select Lead Status"
                  onBlur={handleBlur}
                />
                <FormErrorMessage>{errors.leadStatusId}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.followUpStatusId} isRequired>
                <FormLabel>Follow Up Status</FormLabel>
                <SearchableSelect
                  options={followUpStatusOptions.map(s => ({ label: s.name, value: s._id }))}
                  value={formData.followUpStatusId}
                  onChange={val => handleSelectChange('followUpStatusId', val)}
                  placeholder="Select Follow Up Status"
                  onBlur={handleBlur}
                />
                <FormErrorMessage>{errors.followUpStatusId}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Assigned To</FormLabel>
                <SearchableSelect
                  options={[
                    ...userOptions.map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u._id })),
                    ...assignedUserOption
                  ]}
                  value={formData.assignedToUserId}
                  onChange={val => handleSelectChange('assignedToUserId', val)}
                  placeholder="Select user (optional)"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Reference From Type</FormLabel>
                <Select value={referenceType} onChange={e => setReferenceType(e.target.value)}>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </Select>
              </FormControl>
              {referenceType === 'internal' ? (
                <FormControl>
                  <FormLabel>Reference From (User/Source)</FormLabel>
                  <SearchableSelect
                    options={[
                      ...referenceFromOptions,
                      ...referenceFromFallback
                    ]}
                    value={formData.referanceFromId}
                    onChange={val => handleSelectChange('referanceFromId', val)}
                    placeholder="Select reference (optional)"
                  />
                </FormControl>
              ) : (
                <FormControl>
                  <FormLabel>Reference From (External Name)</FormLabel>
                  <Input
                    value={referanceFromExternalName}
                    onChange={e => setReferanceFromExternalName(e.target.value)}
                    placeholder="Enter external reference name (optional)"
                  />
                  <Text fontSize="xs" color="gray.500">Not required</Text>
                </FormControl>
              )}
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea name="note" value={formData.note} onChange={handleInputChange} placeholder="Add any notes (optional)" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" type="submit">
              {isEditMode ? 'Update' : 'Add Lead'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default LeadFormModal; 