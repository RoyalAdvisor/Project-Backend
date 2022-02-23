const router = require("express").Router();
const Product = require("../models/product");

//Getting all
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
