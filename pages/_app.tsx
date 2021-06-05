import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "../components/NavBar";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ChakraProvider,
  useDisclosure,
} from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider>
      <NavBar onOpenLoginModal={onOpen} />
      <Component {...pageProps} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>LOGIN</ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
export default MyApp;
