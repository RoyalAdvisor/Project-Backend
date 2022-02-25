const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user-route");
const productRoute = require("./routes/product-route");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

mongoose.connect(
  process.env.database_connect,
  { useNewUrlParser: true },
  () => {
    console.log("Connected to MongoDB Database.");
  }
);

app.get("/", (req, res) => {
  res.send("Welcome to our MongoDB REST API");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is active on port ${port}`);
});
