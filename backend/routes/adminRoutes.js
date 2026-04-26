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

router.post('/login', adminLogin);

router.use(protect, adminOnly);

router.route('/products').get(getAdminProducts).post(createAdminProduct);
router.route('/products/:id').get(getAdminProductById).put(updateAdminProduct).delete(deleteAdminProduct);

// Upload route with error handling
router.put('/products/:id/upload', (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err.message);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'File upload error' 
      });
    }
    next();
  });
}, uploadProductImages);

router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateAdminOrderStatus);

module.exports = router;
