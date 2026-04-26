const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// Multer error handler wrapper
const handleUpload = (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('📸 [Upload] Multer error:', err.message);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'File upload error',
        error: err.message
      });
    }
    next();
  });
};

// Test route
router.get("/test", (req, res) => {
  res.json({ 
    success: true,
    message: "Admin API is working" 
  });
});

// Simple add product with single image (for testing)
router.post("/add-product", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image uploaded' 
      });
    }

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
    console.error('❌ [Add Product] Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to add product",
      error: error.message 
    });
  }
});

// Upload endpoint for editing products - matches frontend expectation: /api/admin/products/:id/upload
router.put("/products/:id/upload", handleUpload, (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files || [];

    console.log(`📸 [Upload] Product ID: ${id}, Files: ${files.length}`);

    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No images uploaded' 
      });
    }

    const imageUrls = files.map(file => {
      console.log(`✓ [Upload] File uploaded: ${file.filename}`);
      return file.path;
    });

    // Return the uploaded images
    res.json({
      success: true,
      message: 'Images uploaded successfully',
      images: imageUrls,
      product: {
        id,
        images: imageUrls
      }
    });
  } catch (error) {
    console.error('❌ [Upload] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload images',
      error: error.message 
    });
  }
});

module.exports = router;
