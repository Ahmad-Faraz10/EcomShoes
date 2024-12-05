import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Image, Text, ButtonGroup } from "@chakra-ui/react";
const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ItemData, setItemData] = useState(null);
  const [sizecheck, setsizecheck] = useState();
  const api_url = process.env.REACT_APP_BASE_URL;
  const fetchbyid = async (id) => {
    try {
      const response = await fetch(`${api_url}/item/getone/${id}`);
      const data = await response.json();
      setItemData(data.data);
      console.log("datata", data);
    } catch (error) {
      console.error("Error fetching customer data:", error.message);
    }
  };
  useEffect(() => {
    fetchbyid(id);
    console.log(ItemData);
  }, [id]);
  const addtocart = async (itemid) => {
    try {
      const payload = {
        customerId: localStorage.getItem("id"),
        itemId: itemid,
        quantity: 1,
        Ordersize: sizecheck,
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
      console.log("apple", data);
    } catch (error) {
      console.log("Error fetching cart item:", error.message);
    }
  };
  return (
    <div className="col-md-12 min-vh-100">
      <div className="container">
        {ItemData ? (
          <div className="row  mt-5">
            <div
              className="col-lg-6 col-md-12  col-sm-12 mt-5  "
              data-aos="fade-up"
              data-aos-duration="500"
              data--delay="200ms"
              style={{
                height: window.innerWidth < 768 ? "400px" : "500px",
              }}
            >
              <Image objectFit="cover" maxW="400px" src={ItemData.imageLink} />
            </div>
            <div className="col-lg-6 wow fadeInUp   ">
              <div className="pe-2  mt-5">
                <div className=" mx-auto ">
                  <div className="top_title mb-3">
                    <h2 data-aos="fade-up" data-aos-duration="500">
                      <span>{ItemData.productName}</span>
                    </h2>
                  </div>
                </div>
                <br />
                <p className="lead" data-aos="fade-up" data-aos-duration="600">
                  We are just a group of technology radicals who are constantly
                  at work to surpass their previous best work. At OneBigBit.
                </p>
              </div>
              <p
                textStyle="2xl"
                fontWeight="medium"
                letterSpacing="tight"
                mt="2"
              >
                ${ItemData.price}
              </p>

              <select
                className="form-select"
                id="size"
                name="size"
                onChange={(e) => setsizecheck(e.target.value)} // Make sure to pass the value directly
                required
              >
                <option value="">Select your size</option>
                {ItemData.sizeOptions &&
                  ItemData.sizeOptions.map((data, index) => (
                    <option key={index} value={data.size}>
                      {data.size} - Available Quantity: {data.availableQuantity}
                    </option>
                  ))}
              </select>
            </div>
            <ButtonGroup spacing="2">
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={() => {
                  addtocart(ItemData._id);
                  navigate("/Cart");
                }}
              >
                Buy now
              </Button>
              <Button
                variant="ghost"
                colorScheme="blue"
                onClick={() => {
                  addtocart(ItemData._id);
                }}
              >
                Add to cart
              </Button>
            </ButtonGroup>
          </div>
        ) : (
          <p>Loading item data...</p>
        )}
      </div>
    </div>
  );
};
export default ItemDetails;
