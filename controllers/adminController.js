const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Ready for Dispatch',
  'Shipped',
  'Delivered',
  'Cancelled'
];

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin role required' });
    }

    res.json({
      success: true,
      message: 'Admin login successful',
      admin: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Admin login failed', error: error.message });
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// @desc    Get single product for admin
// @route   GET /api/admin/products/:id
// @access  Private/Admin
exports.getAdminProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Get admin product by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createAdminProduct = async (req, res) => {
  try {
    const {
      legacyId,
      name,
      price,
      originalPrice,
      description,
      image,
      images,
      category,
      stock
    } = req.body;

    const parsedPrice = toNumber(price);
    const parsedOriginalPrice = toNumber(originalPrice);
    const parsedStock = toNumber(stock);

    if (!name || !description || parsedPrice === undefined) {
      return res.status(400).json({ success: false, message: 'name, price and description are required' });
    }

    const product = await Product.create({
      legacyId,
      name,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      description,
      image: image || '',
      images: Array.isArray(images) ? images : (image ? [image] : []),
      category: category || 'General',
      stock: parsedStock ?? 0
    });

    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    console.error('Create admin product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateAdminProduct = async (req, res) => {
  try {
    const updatePayload = {};
    const fields = ['legacyId', 'name', 'description', 'image', 'category'];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field];
      }
    });

    const parsedPrice = toNumber(req.body.price);
    if (parsedPrice !== undefined) updatePayload.price = parsedPrice;

    const parsedOriginalPrice = toNumber(req.body.originalPrice);
    if (parsedOriginalPrice !== undefined) updatePayload.originalPrice = parsedOriginalPrice;

    const parsedStock = toNumber(req.body.stock);
    if (parsedStock !== undefined) updatePayload.stock = parsedStock;

    if (req.body.images !== undefined) {
      updatePayload.images = Array.isArray(req.body.images) ? req.body.images : [];
    } else if (req.body.image !== undefined) {
      updatePayload.images = req.body.image ? [req.body.image] : [];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    console.error('Update admin product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteAdminProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete admin product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
exports.getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get admin order by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateAdminOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!ORDER_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${ORDER_STATUSES.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    res.json({ success: true, message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Update admin order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};
