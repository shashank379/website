const express = require('express');
const router = express.Router();
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

router.route('/products').get(getAdminProducts).post(createAdminProduct);
router.route('/products/:id').get(getAdminProductById).put(updateAdminProduct).delete(deleteAdminProduct);

router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateAdminOrderStatus);

module.exports = router;
