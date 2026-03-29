const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  image: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    required: [true, 'Please provide customer name']
  },
  customerEmail: {
    type: String,
    required: [true, 'Please provide customer email'],
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Please provide customer phone']
  },
  shippingAddress: {
    type: String,
    required: [true, 'Please provide shipping address']
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'RAZORPAY', 'UPI'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING'
  },
  paymentId: {
    type: String
  },
  orderStatus: {
    type: String,
    enum: [
      'Pending',
      'Confirmed',
      'Ready for Dispatch',
      'Shipped',
      'Delivered',
      'Cancelled',
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED'
    ],
    default: 'Pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // Generate order number if not exists
  if (!this.orderNumber) {
    this.orderNumber = 'RTZ' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
