const express = require("express");
const app = express();
const authRoute = require("./routes/auth-route");

app.use("/api/user", authRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is active on port ${port}`);
});
