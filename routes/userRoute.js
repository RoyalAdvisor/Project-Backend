const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/userModel");
const { getUser } = require("../middleware/getItems");
const verifyAcc = require("../middleware/auth-jwt");
const verify = require("../middleware/verifyInfo");
const dotenv = require("dotenv");
dotenv.config();

//Register Route
router.post("/register", verify, async (req, res) => {
  const emailCheck = await user.findOne({ email: req.body.email });
  if (emailCheck) {
    return res.status(400).send({ message: "Email already exists!" });
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const createUser = new user({
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashedPassword,
    phone_number: req.body.phone_number,
    cart: req.body.cart,
  });
  try {
    const saveUser = createUser.save();
    res.status(200).send({ message: "Successfully created new user!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Login Route

router.post("/login", (req, res) => {
  const emailCheck = user.findOne({ email: req.body.email }, (err, user) => {
    if (!emailCheck) return res.sendStatus({ message: err.message });
    if (!user) return res.sendStatus(404);
    const passMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!passMatch) return res.sendStatus(409);
    const token = jwt.sign({ _id: user._id }, process.env.ACC_SECRET_KEY);
    if (!token) return res.sendStatus(401);
    res.header("auth-token", token).send(token);
  });
});

//Get all users
router.get("/", verifyAcc, async (req, res) => {
  const findUsers = await user.find();
  if (!findUsers) return res.sendStatus(404);
  res.send(findUsers);
});

//Get one user
router.get("/:id", verifyAcc, async (req, res) => {
  const findUser = await user.findById(req.params.id);
  if (!findUser) return res.sendStatus(404);
  res.send(findUser);
});

//Update a user
router.put("/:id", [getUser, verifyAcc], async (req, res) => {
  const updatedUser = await res.user.save();
  if (req.body.fullname != null) res.user.fullname = req.body.fullname;
  if (req.body.email != null) res.user.email = req.body.email;
  if (req.body.password != null) res.user.password = req.body.password;
  if (req.body.phone_number != null)
    res.user.phone_number = req.body.phone_number;
  res.status(202).send({ message: "user updated successfully!" });
  if (!updatedUser)
    return res.status(503).send({ message: "User can't be updated!" });
});

//Delete a user
router.delete("/:id", [getUser, verifyAcc], async (req, res) => {
  const deletedUser = await res.user.delete();
  if (!deletedUser)
    return res.status(503).send({ message: "Operation error." });
  res.status(202).send({ message: "User deleted successfully!" });
});

module.exports = router;
