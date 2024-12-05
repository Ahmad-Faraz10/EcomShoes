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
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { CardImg, CardText, CardTitle, CardLink, Row, Col } from "reactstrap";

const Dashboard = () => {
  const api_url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [Item, SetItem] = useState([]);
  useEffect(() => {
    fetchItem();
  }, []);
  const fetchItem = async () => {
    try {
      const response = await fetch(`${api_url}/item/getAll`); // http://localhost:5000
      //const response = await fetch("http://localhost:5020/item/getAll");
      if (!response.ok) {
        throw new Error("Failed to fetch ");
      }
      const data = await response.json();
      console.log(data);
      SetItem(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(Item, "aa", process.env.REACT_APP_BASE_URL, api_url);
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
      <div className="container  min-vh-100">
        <div className=" mt-5">
          <SimpleGrid spacing={4} columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            {Item.map((data, index) => (
              <div className="col-md-12 mt-5" key={index}>
                <a
                  href="javascript:void(0);"
                  onClick={() => {
                    navigate(`/ItemDetails/${data._id}`);
                  }}
                >
                  <Card
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    borderTop="8px"
                    borderColor="#056894"
                    className="d-flex justify-content-center align-items-center"
                  >
                    <CardHeader>
                      <Image
                        src={data.imageLink}
                        alt="service img"
                        height={200}
                        className="img-fluid"
                      />
                    </CardHeader>
                    <CardBody>
                      <h5 size="md" className="text-blue">
                        {" "}
                        {data.productName.split(" ").slice(0, 3).join(" ")}
                      </h5>
                      <p> {data.price}$</p>
                    </CardBody>
                    <CardFooter>
                      <a
                        href="javascript:void(0);"
                        onClick={() => {
                          // window.open(`/InvoicePrint/${data.orderId}`, '_blank')
                          navigate(`/ItemDetails/${data._id}`);
                        }}
                        class="btn btn-icon btn-sm btn-danger-transparent rounded-pill"
                      >
                        <Link>
                          {" "}
                          Click Here <ArrowForwardIcon />{" "}
                        </Link>
                      </a>
                    </CardFooter>
                  </Card>
                </a>
              </div>
            ))}{" "}
          </SimpleGrid>
        </div>{" "}
      </div>
    </>
  );
};
export default Dashboard;
