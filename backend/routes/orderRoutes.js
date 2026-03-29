const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByEmail,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/create', createOrder);
router.get('/user/:email', getOrdersByEmail);
router.get('/:id', getOrderById);

// Admin routes (add auth middleware when needed)
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
