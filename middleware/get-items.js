const Product = require("../models/product-model");
const User = require("../models/user-model");

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  res.product = product;
  next();
}

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "Product not found." });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  res.user = user;
  next();
}

module.exports = {
  getUser: getUser,
  getProduct: getProduct,
};
