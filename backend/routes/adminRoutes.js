const express = require("express");
const router = express.Router();

// TEMP TEST ROUTE
router.post("/add-product", (req, res) => {
  res.json({
    message: "Admin product route working",
    data: req.body
  });
});

module.exports = router;
