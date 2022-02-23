const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth-route");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());
app.use("/api/user", authRoute);

mongoose.connect(
  process.env.database_connect,
  { useNewUrlParser: true },
  () => {
    console.log("Connected to MongoDB Database.");
  }
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is active on port ${port}`);
});
