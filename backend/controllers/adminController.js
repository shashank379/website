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
    
    console.log(`📝 [Admin Login] Request received for email: ${email}`);

    const normalizedEmail = (email || '').toLowerCase().trim();
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const configuredAdminPassword = (process.env.ADMIN_PASSWORD || '').trim();

    if (!configuredAdminEmail) {
      console.error('❌ [Admin Login] ADMIN_EMAIL env var not set');
      return res.status(500).json({ success: false, message: 'Server configuration error: ADMIN_EMAIL not set' });
    }

    if (!configuredAdminPassword) {
      console.error('❌ [Admin Login] ADMIN_PASSWORD env var not set');
      return res.status(500).json({ success: false, message: 'Server configuration error: ADMIN_PASSWORD not set' });
    }

    if (normalizedEmail !== configuredAdminEmail) {
      console.warn(`⚠️ [Admin Login] Email mismatch: ${normalizedEmail} !== ${configuredAdminEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    if (password !== configuredAdminPassword) {
      console.warn(`⚠️ [Admin Login] Password mismatch for ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.warn(`⚠️ [Admin Login] User not found in database for ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!(await user.matchPassword(password))) {
      console.warn(`⚠️ [Admin Login] Password mismatch in database for ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      console.warn(`⚠️ [Admin Login] User ${normalizedEmail} role is ${user.role}, not admin`);
      return res.status(403).json({ success: false, message: 'Admin role required' });
    }

    console.log(`✅ [Admin Login] Successful login for ${user.email}`);

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
    console.error(`❌ [Admin Login] Server Error: ${error.message}`);
    console.error('Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Admin login failed - server error', error: error.message });
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
      category,
      stock
    } = req.body;

    const parsedPrice = toNumber(price);
    const parsedOriginalPrice = toNumber(originalPrice);
    const parsedStock = toNumber(stock);

    if (!name || !description || parsedPrice === undefined) {
      return res.status(400).json({ success: false, message: 'name, price and description are required' });
    }

    // Handle uploaded images from multer
    const uploadedFiles = req.files || [];
    const imageUrls = uploadedFiles.map(file => file.path);
    
    // Also support string/array fallback if sent directly
    let finalImages = imageUrls.length > 0 ? imageUrls : [];
    if (finalImages.length === 0) {
      if (Array.isArray(req.body.images)) finalImages = req.body.images;
      else if (req.body.image) finalImages = [req.body.image];
    }

    const product = await Product.create({
      legacyId,
      name,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      description,
      image: finalImages.length > 0 ? finalImages[0] : '',
      images: finalImages,
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

// @desc    Upload product images
// @route   PUT /api/admin/products/:id/upload
// @access  Private/Admin
exports.uploadProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadedFiles = req.files || [];

    console.log(`📸 [Upload Images] Product ID: ${id}, Files received: ${uploadedFiles.length}`);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.warn(`⚠️ [Upload Images] No files uploaded for product ${id}`);
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    // Extract URLs from uploaded files
    const imageUrls = uploadedFiles.map(file => {
      console.log(`📤 [Upload Images] Uploaded file: ${file.filename} -> ${file.path}`);
      return file.path;
    });

    // Update product with new images and other fields
    let finalImages = [...imageUrls];
    if (req.body.existingImages) {
      const existing = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
      finalImages = [...existing, ...imageUrls];
    }
    const updatePayload = { images: finalImages };

    // Include other fields if provided in form data
    const fields = ['name', 'description', 'price', 'originalPrice', 'category', 'stock'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'price' || field === 'originalPrice' || field === 'stock') {
          const num = toNumber(req.body[field]);
          if (num !== undefined) updatePayload[field] = num;
        } else {
          updatePayload[field] = req.body[field];
        }
      }
    });

    console.log(`🔄 [Upload Images] Updating product ${id} with payload:`, updatePayload);

    const product = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true
    });

    if (!product) {
      console.error(`❌ [Upload Images] Product not found: ${id}`);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log(`✅ [Upload Images] Successfully updated product ${id}`);
    res.json({ success: true, message: 'Images uploaded and product updated', product });
  } catch (error) {
    console.error(`❌ [Upload Images] Error:`, error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload images', 
      error: error.message 
    });
  }
};
