import {
  Box,
  Flex,
  Text,
  Heading,
  IconButton,
  Button,
  Stack,
  Collapse,
  Link,
  Square,
  useColorModeValue,
  useColorMode,
  useBreakpointValue,
  useDisclosure,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { AuthContext } from "../context/Auth";
import { useContext } from "react";
import firebase from "firebase";

type Props = {
  onOpenLoginModal: () => void;
};

const NavBar: React.FC<Props> = ({ onOpenLoginModal }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentUser} = useContext(AuthContext);

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.500")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "start" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Heading
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            size="md"
          >
            <Link href="/">SkateSpot.com</Link>
          </Heading>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={4}
        >
          <Square>
            {colorMode === "light" ? (
              <SunIcon onClick={toggleColorMode} />
            ) : (
              <MoonIcon onClick={toggleColorMode} />
            )}
          </Square>
          {console.log(currentUser)}
          {currentUser?.name ? (
            <Avatar
              name={currentUser.name}
              size="sm"
              src="https://bit.ly/tioluwani-kolawole"
            />
          ) : (
            <Button
              display={{ base: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"purple.600"}
              isLoading={currentUser === undefined}
              onClick={onOpenLoginModal}
              _hover={{
                bg: "purple.400",
              }}
            >
              Log In
            </Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <NavItemWrap />
      </Collapse>
    </Box>
  );
};
export default NavBar;

const DesktopNav = () => {
  return (
    <Stack direction={"row"} spacing={4}>
      {/* のちに検索フォームなどをいれる */}
    </Stack>
  );
};

const NavItemWrap = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast()

  const logout = () => {
    setCurrentUser(null);
    firebase.auth().signOut().then(() => {
      toast({
        title: "ログアウトしました",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    })
  };

  return (
    <Stack bg={useColorModeValue("white", "gray.800")} p={4}>
      {NAV_ITEMS.map((navItem) => (
        <NavItem key={navItem.label} {...navItem} />
      ))}
      {currentUser && (
        <Button w={60} onClick={logout}>
          Logout
        </Button>
      )}
    </Stack>
  );
};

const NavItem = ({ label, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack
      spacing={4}
      onClick={onToggle}
      bg={useColorModeValue("white", "gray.800")}
    >
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "新しいスポットを投稿する",
    href: "/spot/new",
  },
  {
    label: "マイページ",
  },
  {
    label: "利用規約",
    href: "#",
  },
  {
    label: "お問い合わせ",
    href: "#",
  },
];
