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
  SimpleGrid,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { CardImg, CardText, CardTitle, CardLink, Row, Col } from "reactstrap";
const Search = () => {
  const api_url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [searchinput, setSearchinput] = useState();
  const handlesearch = async (e) => {
    const searchinputs = e.target.value;
    setSearchinput(searchinputs);
    try {
      const response = await fetch(
        `${api_url}/item/search/api?q=${searchinput}`
      );
      const data = await response.json();
      setSearchResults(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const addtocart = async (itemid) => {
    try {
      const payload = {
        customerId: localStorage.getItem("id"),
        itemId: itemid,
        quantity: 1,
        action: "add",
      };
      const id = localStorage.getItem("id");
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
      console.log(data);
    } catch (error) {
      console.log("Error fetching cart item:", error.message);
    }
  };
  return (
    <>
      <div className="container min-vh-100">
        <input
          type="search"
          onChange={handlesearch}
          placeholder="Search Here"
          className="form-control"
        />
      </div>
      <div className=" mt-5">
        <SimpleGrid spacing={4} columns={{ base: 1, sm: 2, md: 2, lg: 3 }}>
          {searchResults.map((data, index) => (
            <div className="col-md-12 mt-5" key={index}>
              <Card maxW="sm">
                <CardBody>
                  {data.productImage ? (
                    <Image
                      src={`${api_url}/productImage/${data.productImage}`}
                      alt="..."
                      borderRadius="lg"
                      style={{
                        height: "250px",
                        width: "330px",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <Image
                      src="https://media.istockphoto.com/id/1442933582/tr/vekt%C3%B6r/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=orfn0hE2ar86AEOUXLCue8tS0IMzTRcb3EFvfW4orq0="
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "5px",
                      }}
                      alt=""
                    />
                  )}
                  <Stack mt="6" spacing="1">
                    <Heading size="md">{data.name}</Heading>
                    <Text>{data.description}</Text>
                    <Text color="blue.600" fontSize="2xl">
                      ${data.price}
                    </Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => {
                        addtocart(data._id);
                        navigate("/Cart");
                      }}
                    >
                      Buy now
                    </Button>
                    <Button
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => {
                        addtocart(data._id);
                      }}
                    >
                      Add to cart
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </div>
          ))}{" "}
        </SimpleGrid>
      </div>
    </>
  );
};
export default Search;
