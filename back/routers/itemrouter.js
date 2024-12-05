const express = require("express");
const Item = require("../models/item");
const router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imageLink/");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/insert", upload.single("imageLink"), async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      price,
      productRating,
      sizeOptions,
    } = req.body;
    // Construct the image link based on the uploaded file
    const imageLink = req.file ? `${req.file.filename}` : null;
    const itemData = req.body;
    const newItem = new Item(itemData);
    const savedItem = await newItem.save();
    // Respond with success and the saved item
    res.status(201).json({
      message: "Item successfully inserted",
      item: savedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error inserting item",
      error: error.message,
    });
  }
});
router.get("/getall", async (req, res) => {
  try {
    const neworder = await Item.find();
    res.json(neworder);
  } catch (error) {
    res.json(error);
  }
});
router.get("/getone/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const newItem = await Item.findById(ID);
    await newItem.save();
    res.status(201).json({ data: newItem });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
