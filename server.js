const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongodb = require("mongodb").MongoClient;
const productsRouter = require("./routes/product-route");
const port = process.env.PORT || 5000;
require("dotenv").config();

// mongodb.connect(process.env.database_connect, (err, db) => {
//   if (err) throw err;
//   let dbs = db.db("myFirstDatabase");
//   dbs.createCollection("products", (err, res) => {
//     if (err) throw err;
//     console.log("collection created!");
//     db.close();
//   });
// });
mongoose.connect(process.env.database_connect, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.use("/products", productsRouter);

app.listen(port, () => console.log(`Server has started on port ${port}`));
