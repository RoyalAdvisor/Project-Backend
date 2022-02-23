const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  img: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
//   created_by: {
//     type: User_ID,
//     required: true,
//   },
});

module.exports = mongoose.model("Product", productSchema);
