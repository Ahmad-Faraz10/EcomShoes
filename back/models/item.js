const mongoose = require("mongoose");
const ItemSchema = new mongoose.Schema({
  imageLink: {
    type: String,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  productRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  sizeOptions: [
    {
      size: {
        type: String,
        required: true,
      },
      availableQuantity: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
