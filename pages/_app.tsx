import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "../src/components/NavBar/NavBar";
import { ChakraProvider, useDisclosure, Box } from "@chakra-ui/react";
import { AuthProvider } from "../src/context/Auth";
import { ImageCacheProvider } from "../src/context/ImageCache";
import AuthModal from "../src/components/AuthModal/AuthModal";
import Footer from "../src/components/Footer/Footer";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/spot/new");
  }, []);

  return (
    <ChakraProvider>
      <ImageCacheProvider>
        <AuthProvider>
          <Box minHeight="150vh">
            <NavBar onOpenLoginModal={onOpen} />
            <AuthModal isOpen={isOpen} onClose={onClose} />
            <Component {...pageProps} />
          </Box>
          <Footer />
        </AuthProvider>
      </ImageCacheProvider>
    </ChakraProvider>
  );
}
export default MyApp;
