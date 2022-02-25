const router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("../config/auth-config");
const bcrypt = require("bcryptjs");
const user = require("../models/user-model");
const { getUser } = require("../middleware/get-items");

//Register Route
router.post("/register", async (req, res) => {
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
    const token = jwt.sign({ _id: user._id }, config.secret);
    if (!token) return res.sendStatus(401);
    res.header("auth-token", token).send(token);
  });
});

//Get all users
router.get("/", async (req, res) => {
  const findUsers = await user.find();
  if (!findUsers) return res.sendStatus(404);
  res.send(findUsers);
});

//Get one user
router.get("/:id", getUser, async (req, res) => {
  const findUser = await user.findById(req.params.id);
  if (!findUser) return res.sendStatus(404);
  res.send(findUser);
});

//Update a user
router.put("/:id", getUser, async (req, res) => {
  if (req.body.fullname != null) res.user.fullname = req.body.fullname;
  if (req.body.email != null) res.user.email = req.body.email;
  if (req.body.password != null) res.user.password = req.body.password;
  if (req.body.phone_number != null)
    res.user.phone_number = req.body.phone_number;
  try {
    const updatedUser = await res.user.save();
    res.status(202).send({ message: "user updated successfully!" });
  } catch (error) {
    return res.status(503).send({ message: error.message });
  }
});

//Delete a user
router.delete("/:id", getUser, async (req, res) => {
  const deletedUser = await res.user.delete();
  if (!deletedUser)
    return res.status(503).send({ message: "Operation error." });
  res.status(202).send({ message: "User deleted successfully!" });
});

module.exports = router;
