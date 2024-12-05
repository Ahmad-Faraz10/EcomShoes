import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Box,
  Center,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
const Cart = () => {
  const api_url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [cartItem, SetcartItem] = useState([]);
  const [address, setAddress] = useState();
  const [sizecheck, setsizecheck] = useState();
  useEffect(() => {
    const login = localStorage.getItem("authToken");
    if (!login) {
      navigate("/Login");
    }
  });
  useEffect(() => {
    fetchcartItem();
    console.log(cartItem);
  }, []);
  const fetchcartItem = async () => {
    try {
      const id = localStorage.getItem("id");
      const response = await fetch(`${api_url}/order/getone`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart item");
      }
      const data = await response.json();
      console.log("cart", data);
      SetcartItem(data); // Assuming setCartItem is a state setter function
    } catch (error) {
      console.log("Error fetching cart item:", error.message);
    }
  };

  const placeorder = async () => {
    try {
      const id = localStorage.getItem("id");
      const response = await fetch(`${api_url}/order/placedorder`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: id, address: address }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart item");
      }
      const data = await response.json();
      fetchcartItem();
      Swal.fire({
        title: "Place Order",
        text: data.message,
        icon: "success",
      });
      console.log(data);

      // Assuming setCartItem is a state setter function
    } catch (error) {
      console.log("Error fetching cart item:", error.message);
      fetchcartItem();
    }
  };
  const addtocart = async (itemid, s, act) => {
    console.log("aa", itemid, s, act);
    try {
      const payload = {
        customerId: localStorage.getItem("id"),
        itemId: itemid,
        quantity: 1,
        Ordersize: s,
        action: act,
      };

      const response = await fetch(`${api_url}/order/addtocart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart item");
      }
      const data = await response.json();
      console.log("apple", data);
      fetchcartItem();
    } catch (error) {
      console.log("Error fetching cart item:", error.message);
    }
  };
  return (
    <>
      {" "}
      <main className="flex-grow-1  min-vh-100">
        <div className="container ">
          <div className="row">
            <div className="col-md-8">
              <div className="mt-5">
                {cartItem && cartItem.items && cartItem.items.length > 0 ? (
                  cartItem.items.map((data, index) => (
                    <SimpleGrid
                      key={index}
                      spacing={4}
                      columns={{ base: 1, sm: 1, md: 1, lg: 1 }}
                    >
                      <Card
                        direction={{ sm: "row" }}
                        overflow="hidden"
                        variant="outline"
                      >
                        <Image
                          objectFit="contain"
                          src={data.item.imageLink}
                          alt={data.item.productName}
                          style={{
                            height: "150px",
                            width: "150px",
                            borderRadius: "5px",
                          }}
                        />
                        <Stack>
                          <CardBody>
                            <Heading size="md">{data.item.productName}</Heading>
                            <Text py="2">
                              {data.item.productName} (Size: {data.Ordersize})
                            </Text>
                            <Text py="2">${data.item.price.toFixed(2)}</Text>
                            <Heading size="md"> peices:{data.quantity}</Heading>
                          </CardBody>
                        </Stack>
                        <Stack direction="row" spacing={4} align="center">
                          <Button
                            colorScheme="teal"
                            variant="outline"
                            onClick={() => {
                              addtocart(data.item._id, data.Ordersize, "add");
                            }}
                          >
                            <AddIcon />
                          </Button>
                          <Input
                            htmlSize={4}
                            width="auto"
                            colorScheme="teal"
                            value={data && data.quantity}
                            variant="outline"
                          />
                          <Button
                            colorScheme="teal"
                            variant="outline"
                            onClick={() => {
                              addtocart(data.item._id, data.Ordersize, "ded");
                            }}
                          >
                            <MinusIcon />
                          </Button>
                        </Stack>
                      </Card>
                    </SimpleGrid>
                  ))
                ) : (
                  <p>No items in the cart</p>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <Box p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">
                  Total Money: $ {cartItem.totalAmount}{" "}
                </Heading>
                <Text mt={4}>
                  {" "}
                  {cartItem && cartItem.data && cartItem.length > 0
                    ? cartItem.data[0].totalAmount
                    : null}
                  {/* {cartItem && cartItem.data && cartItem.data[0].totalAmount} */}
                </Text>
                <input
                  type="search"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  placeholder="address"
                  required
                />
                <Box
                  as="button"
                  borderRadius="md"
                  bg="tomato"
                  color="white"
                  px={4}
                  h={8}
                  onClick={() => {
                    placeorder();
                  }}
                >
                  Place Order
                </Box>
              </Box>
            </div>
          </div>{" "}
        </div>
      </main>
    </>
  );
};
export default Cart;
