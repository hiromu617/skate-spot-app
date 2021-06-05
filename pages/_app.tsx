import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "../src/components/NavBar";
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
import { AuthProvider } from "../src/context/Auth";
import AuthModal from "../src/components/AuthModal";

function MyApp({ Component, pageProps }: AppProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider>
      <AuthProvider>
        <NavBar onOpenLoginModal={onOpen} />
        <AuthModal isOpen={isOpen} onClose={onClose}/>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}
export default MyApp;
