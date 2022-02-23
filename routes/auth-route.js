const router = require("express").Router();

router.post("/register", (req, res) => {
  res.send("Register working");
});

module.exports = router;
