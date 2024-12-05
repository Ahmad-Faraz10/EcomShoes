import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../Page/Dashboard";
import Contact from "../Page/Contact";
import Header from "../Nav/Header";
import Login from "../Page/Login";
import Cart from "../Page/Cart";
import OrderHistory from "../Page/OrderHistory";
import Footer from "../Nav/Footer";
import Search from "../Page/Search";
import Register from "../Page/Register";
import ItemDetails from "../Page/ItemDetails";
const AllRouters = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ItemDetails/:id" element={<ItemDetails />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/OrderHistory" element={<OrderHistory />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default AllRouters;
