import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react';

import ModalOverlay from 'components/ModalOverlay';

import SlippageForm from '@/app/sendashboard/leverage/_forms/SlippageForm';

interface SlippageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlippageModal: React.FC<SlippageModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="white">SETTINGS</ModalHeader>
        <ModalCloseButton />
        <ModalBody px={[8, 8, '2.005vw']} py={[8, 8, '2.005vw']}>
          <SlippageForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SlippageModal;
