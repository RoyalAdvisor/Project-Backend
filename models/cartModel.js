const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    cartContents: {
      type: Object,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "myFirstDatabase" }
);

const cart = mongoose.model("Cart", cartSchema);

module.exports = cart;
