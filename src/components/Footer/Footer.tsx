import {
  Box,
  Stack,
  Text,
  ButtonGroup,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { FaGithub, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      as="footer"
      role="contentinfo"
      mx="auto"
      maxW="7xl"
      pt="12"
      pb="6"
      px={{ base: "4", md: "8" }}
    >
      <Stack spacing="10">
        <Divider />
        <Stack
          direction={{ base: "column-reverse", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="sm" alignSelf={{ base: "center", sm: "start" }}>
            &copy; {new Date().getFullYear()} Hiromu Kawai. All rights reserved.
          </Text>
          <ButtonGroup variant="ghost" color="gray.600">
            <IconButton
              as="a"
              href="#"
              aria-label="GitHub"
              icon={<FaGithub fontSize="20px" />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Instagram"
              icon={<FaInstagram fontSize="20px" />}
            />
          </ButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
