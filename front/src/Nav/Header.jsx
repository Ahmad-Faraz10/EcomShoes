import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Image,
  MenuItem,
  Icon,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import Swal from "sweetalert2";
import { HamburgerIcon, CloseIcon, AddIcon, MoonIcon } from "@chakra-ui/icons";
import { Row, Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Navigate } from "react-router-dom";

const Links = ["OrderHistory", "Search"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={children}
  >
    {children}
  </Link>
);

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const Log_Out = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("authToken");
        const api_url = process.env.REACT_APP_BASE_URL;
        const response = await fetch(`${api_url}/user/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const results = await response.json();
        if (results.status === 1) {
          navigate("/");
          localStorage.removeItem("authToken");
          localStorage.removeItem("name");
          setShow(false);
        } else {
          Swal.fire({
            title: "Error!",
            text: "Error ",
            icon: "error",
          });
          console.log("errror");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const [show, setShow] = useState(false);
  useEffect(() => {
    const data = localStorage.getItem("authToken");
    if (data) setShow(true);
    console.log(show, "show");
  }, [localStorage.getItem("authToken")]);
  return (
    <>
      <Box
        bg={useColorModeValue("blue.300", "green.900")}
        color={useColorModeValue("white.700", "gray.200")}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <a href="/">
              <Image
                src="../assets/aa.png" // Replace with your actual image URL or path
                alt="Logo"
                width={150} // Adjust the width as needed
                height={50} // Adjust the height as needed
              />
            </a>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {show ? (
              <Stack direction={"row"} spacing={6}>
                <Icon
                  as={FiShoppingCart}
                  h={7}
                  w={7}
                  alignSelf={"center"}
                  onClick={() => navigate("/Cart")}
                />

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={
                        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                      }
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>{localStorage.getItem("name")}</MenuItem>
                    <MenuItem onClick={Log_Out}>Log Out</MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            ) : (
              <Button
                variant={"solid"}
                colorScheme={"teal"}
                size={"sm"}
                mr={4}
                onClick={() => navigate("/Login")}
              >
                Log In
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      {/* <Box p={4}>Main Content Here</Box> */}
    </>
  );
};
export default Header;
