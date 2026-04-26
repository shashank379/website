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
router.put('/products/:id/upload', upload.array('images', 5), uploadProductImages);

router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateAdminOrderStatus);

module.exports = router;
