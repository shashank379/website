const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// Add product with image upload
router.post("/add-product", upload.single("image"), (req, res) => {
  try {
    const { name, price, description } = req.body;

    const imageUrl = req.file.path;

    res.json({
      success: true,
      message: "Product added successfully",
      product: {
        name,
        price,
        description,
        image: imageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
