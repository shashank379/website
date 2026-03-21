const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');
const {
  adminLogin,
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);

router.use(protect, adminOnly);

// Add Product with Cloudinary Images
router.post('/add-product', upload.array('images', 5), async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    const imageUrls = req.files.map((file) => file.path);

    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      image: imageUrls[0],
      images: imageUrls
    });

    await product.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.route('/products').get(getAdminProducts).post(createAdminProduct);
router.route('/products/:id').get(getAdminProductById).put(updateAdminProduct).delete(deleteAdminProduct);

router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateAdminOrderStatus);

module.exports = router;
