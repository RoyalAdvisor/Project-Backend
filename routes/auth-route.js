const router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("../config/auth-config");
const bcrypt = require("bcryptjs");
const user = require("../models/user-model");

//Register Route
router.post("/register", async (req, res) => {
  const emailCheck = await user.findOne({ email: req.body.email });
  if (emailCheck)
    return res.status(400).send({ message: "Email already exists!" });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const createUser = new user({
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashedPassword,
    phone_number: req.body.phone_number,
    cart: req.body.cart,
  });
  try {
    const saveUser = await createUser.save();
    res.status(200).send({ message: "User registration successful!" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Login Route

router.post("/login", async (req, res) => {
  const emailCheck = await user.findOne({ email: req.body.email });
  if (!emailCheck)
    return res.status(400).send({ message: "Invalid email address!" });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (hashedPassword != user.password) {
    return res.status(400).send({ message: "Invalid password or email!" });
  } else {
    res.header("auth-token", token).send(token);
    const token = jwt.sign({ _id: user._id }, config.secret);
  }
});

module.exports = router;
