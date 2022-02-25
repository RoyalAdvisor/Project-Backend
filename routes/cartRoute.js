const Cart = require("../models/cartModel");
const router = require("express").Router();
const userId = req.user.id;

const cartOrder = new Cart({
  userId,
  cardContents: cartData,
});

const createCartItem = cartOrder.save();
