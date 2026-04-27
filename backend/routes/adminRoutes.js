const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadProductImages,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

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

router.post('/login', adminLogin);

router.use(protect, adminOnly);

// Standard product routes
router.route('/products')
  .get(getAdminProducts)
  .post(handleUpload, createAdminProduct);

router.route('/products/:id')
  .get(getAdminProductById)
  .put(updateAdminProduct)
  .delete(deleteAdminProduct);

// Upload endpoint for editing products
router.put('/products/:id/upload', handleUpload, uploadProductImages);

// Explicit add-product route matching AdminAddProduct frontend logic
router.post('/add-product', handleUpload, createAdminProduct);

router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateAdminOrderStatus);

module.exports = router;
