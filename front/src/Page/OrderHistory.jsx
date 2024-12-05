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
  Divider,
  ButtonGroup,
  Avatar,
  useColorModeValue,
  StackDivider,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { CardImg, CardText, CardTitle, CardLink, Row, Col } from "reactstrap";

const OrderHistory = () => {
  const api_url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [Item, SetItem] = useState();

  const fetchorder = async () => {
    try {
      const id = localStorage.getItem("id");
      const response = await fetch(`${api_url}/order/historyofcustomer`, {
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
      console.log(data, "dfsfasfa");
      SetItem(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchorder();
    console.log(Item);
  }, []);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-10">
            <Card>
              <CardHeader>
                <Heading size="md">Order History</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {Item &&
                    Item.data &&
                    Item.data.map((order) => (
                      <Box key={order._id} p={5} shadow="md" borderWidth="1px">
                        <Text>
                          <div style={{ color: "#001935" }}>
                            {" "}
                            Order date:
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </Text>
                        {order.items.map((data, index) => (
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
                                  <Heading size="md">
                                    {data.item.productName}
                                  </Heading>
                                  <Text py="2">
                                    {data.item.productName} (Size:{" "}
                                    {data.Ordersize})
                                  </Text>
                                  <Text py="2">
                                    ${data.item.price.toFixed(2)}
                                  </Text>
                                  <Heading size="md">
                                    {" "}
                                    peices:{data.quantity}
                                  </Heading>
                                </CardBody>
                              </Stack>
                            </Card>
                          </SimpleGrid>
                        ))}

                        <Heading
                          size="xs"
                          // textTransform="uppercase"
                        >
                          {order.items.map((item) => item.item.name).join(", ")}
                        </Heading>
                        <Text pt="2" fontSize="sm" colorScheme="blue">
                          Total Amount: {order.totalAmount}
                        </Text>
                        <Badge ml="1" fontSize="0.8em" colorScheme="green">
                          {order.status}
                        </Badge>
                      </Box>
                    ))}
                </Stack>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
