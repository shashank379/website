const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByEmail,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');

// Public routes
router.post('/create', createOrder);
router.get('/user/:email', getOrdersByEmail);
router.get('/:id', getOrderById);

// Admin routes (add auth middleware when needed)
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
