const router = require("express").Router();
const Product = require("../models/product-model");
const { getProduct } = require("../middleware/get-items");

//Getting all products.
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Getting one product.
router.get("/:id", getProduct, (req, res) => {
  res.send(res.product);
});

//Creating one product.
router.post("/", async (req, res) => {
  const product = new Product({
    title: req.body.title,
    catergory: req.body.catergory,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    created_by: req.body.created_by,
  });
  try {
    const newProduct = await product.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Updating one product.
router.put("/:id", getProduct, async (req, res) => {
  if (req.body.title != null) {
    res.product.title = req.body.title;
  }
  if (req.body.catergory != null) {
    res.product.catergory = req.body.catergory;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  if (req.body.image != null) {
    res.product.image = req.body.image;
  }
  if (req.body.price != null) {
    res.product.price = req.body.price;
  }
  if (req.body.created_by != null) {
    res.product.created_by = req.body.created_by;
  }
  try {
    const updateProduct = await res.product.save();
    res.send(updateProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Delete one product.
router.delete("/:id", getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.send({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
