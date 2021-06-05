import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  useColorModeValue
} from "@chakra-ui/react";
import firebase from "../../constants/firebase";
import { AuthContext } from "../context/Auth";
import { FC, useEffect, useContext } from "react";
import { FcGoogle } from 'react-icons/fc'
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const toast = useToast()
  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Login</ModalHeader>
      <ModalBody>
        利用規約とプライバシーポリシーに同意した上でログインして下さい。
      </ModalBody>
        <ModalFooter>
          <Button color={useColorModeValue("gray.800", "white")} variant="outline" colorScheme="whiteAlpha" leftIcon={<FcGoogle />} onClick={login}>Login with Google</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default AuthModal;
