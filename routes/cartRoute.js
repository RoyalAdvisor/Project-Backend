const router = require("express").Router();
const verifyAcc = require("../middleware/auth-jwt");
const { getUser } = require("../middleware/getItems");
const { getProduct } = require("../middleware/getItems");
const product = require("../models/productModel");
const user = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.get("/", [verifyAcc, getUser], (req, res) => {
  return res.send(res.user.cart);
});

router.post("/:id", [verifyAcc, getUser], async (req, res) => {
  const newCartItem = await product.findById(req.params.id).lean();
  let quantity = req.body.quantity;
  const cart = res.user.cart;
  let addedToCart = false;
  cart.forEach((item) => {
    if (item._id == newCartItem._id) {
      item.quantity += quantity;
      addedToCart = true;
    }
  });
  if (!addedToCart) cart.push({ ...newCartItem, quantity });
  try {
    res.user.cart = cart;
    let accToken = jwt.sign(
      { _id: req.userId, cart: res.user.cart },
      process.env.ACC_SECRET_KEY,
      {
        expiresIn: 86400,
      }
    );
    const updatedUser = res.user.save();
    res.status(200).send({ updatedUser, accToken });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
});

router.put("/:id", [verifyAcc, getProduct], async (req, res) => {
  const User = await user.findById(req.userId);
  const product = res.product;
  const cart = User.cart;
  let updatedUser;
  cart.forEach(async (item) => {
    if (item._id.valueOf() == product._id.valueOf()) {
      item.quantity = req.body.quantity;
    }
  });
  updatedUser = await User.save();
  try {
    const accToken = jwt.sign(
      JSON.stringify(updatedUser),
      process.env.ACC_SECRET_KEY
    );
    res.status(200).send({ jwt: accToken, updatedUser });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
});

router.delete("/:id", [verifyAcc, getProduct], async (req, res) => {
  const User = await user.findById(req.userId);
  const product = res.product;
  let newCart = User.cart;
  let updatedUser;
  newCart.forEach(async (item) => {
    if (item._id.valueOf() == product._id.valueOf()) {
      newCart = newCart.filter(
        (cart_item) => cart_item._id.valueOf() != product._id.valueOf()
      );
    }
  });
  try {
    User.cart = newCart;
    updatedUser = await User.save();
    let accToken = jwt.sign(
      JSON.stringify(updatedUser),
      process.env.ACC_SECRET_KEY
    );
    res.status(200).send({ jwt: accToken, updatedUser });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
});

module.exports = router;
