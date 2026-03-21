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

// Edit Product with optional new Cloudinary Images
router.put('/products/:id/upload', upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, price, originalPrice, description, category, stock } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined && price !== '') product.price = Number(price);
    if (originalPrice !== undefined && originalPrice !== '') product.originalPrice = Number(originalPrice);
    if (category !== undefined) product.category = category;
    if (stock !== undefined && stock !== '') product.stock = Number(stock);

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      product.image = imageUrls[0];
      product.images = imageUrls;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Edit product upload error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.route('/products').get(getAdminProducts).post(createAdminProduct);
router.route('/products/:id').get(getAdminProductById).put(updateAdminProduct).delete(deleteAdminProduct);

router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateAdminOrderStatus);

module.exports = router;
