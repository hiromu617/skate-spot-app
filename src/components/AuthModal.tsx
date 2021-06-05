import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean,
  onClose: () => void
};

const AuthModal: React.FC<Props> = ({isOpen, onClose}) => {
  return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>LOGIN</ModalBody>
          </ModalContent>
        </Modal>
  );
}
export default AuthModal;
