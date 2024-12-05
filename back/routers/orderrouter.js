const express = require("express");
const Order = require("../models/order");
const Item = require("../models/item");
const User = require("../models/user");
const { mongoose } = require("mongoose");
const router = express.Router();

router.post("/addtocart", async (req, res) => {
  try {
    const { customerId, itemId, quantity, Ordersize, action } = req.body;
    if (!customerId || !itemId || !quantity || !Ordersize || !action) {
      return res.status(400).json({
        error: "customerId, itemId, and quantity, size, action are required",
      });
    }
    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    let order = await Order.findOne({
      customer: customerId,
      status: "pending",
    });
    if (!order) {
      order = new Order({
        customer: customerId,
        items: [],
        totalAmount: 0,
        status: "pending",
      });
    }
    const existingItem = order.items.find(
      (item) => item.item.equals(itemId) && item.Ordersize === Ordersize
    );
    if (action == "add") {
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        order.items.push({ item: itemId, quantity, Ordersize });
      }
    } else if (action == "ded") {
      if (existingItem) {
        existingItem.quantity -= quantity;
        if (existingItem.quantity <= 0) {
          order.items = order.items.filter((item) => !item.item.equals(itemId));
        }
      }
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
    const itemPromises = order.items.map(async (orderItem) => {
      const itemData = await Item.findById(orderItem.item);
      return itemData.price * orderItem.quantity;
    });
    const itemPrices = await Promise.all(itemPromises);
    order.totalAmount = itemPrices.reduce((total, price) => total + price, 0);

    await order.save();
    res.status(201).json({ message: order });
    console.log("addtocart:------", order);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/placedorder", async (req, res) => {
  try {
    const { customerId, address } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }
    let order = await Order.findOne({
      customer: customerId,
      status: "pending",
    });
    if (!order) {
      return res
        .status(404)
        .json({ error: "Pending order not found for this customer" });
    }
    for (let orderItem of order.items) {
      const item = await Item.findById(orderItem.item);
      if (!item) {
        return res
          .status(404)
          .json({ error: `Item ${orderItem.item} not found` });
      }

      if (item.availableQuantity < orderItem.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for item ${orderItem.item}` });
      }

      // Deduct the quantity from the item
      item.availableQuantity -= orderItem.quantity;
      await item.save(); // Save the updated item
    }
    order.status = "placed";
    order.address = address;

    await order.save();

    res.status(200).json({ message: "Order status changed to placed", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/allorder/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({
      customer: customerId,
    });
    // .populate({
    //   path: "Items.item",
    //   model: "Item",
    // });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/getone", async (req, res) => {
  try {
    const { ID } = req.body;
    const orderdata = await Order.find({ customer: ID, status: "pending" })
      .populate({
        path: "items.item",
        model: "Item",
        select: "imageLink productName price",
      })
      .populate({
        path: "customer",
        select: "username",
      });

    res.status(201).json(orderdata[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/historyofcustomer", async (req, res) => {
  try {
    const { ID } = req.body;
    const orderdata = await Order.find({
      customer: ID,
      status: { $ne: "pending" },
    })
      .populate({
        path: "items.item",
        model: "Item",
        select: "imageLink productName price",
      })
      .populate({
        path: "customer",
        select: "username",
      });

    res.status(201).json({data:orderdata});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
