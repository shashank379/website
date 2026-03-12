const Order = require('../models/Order');
const { sendOrderEmails } = require('../utils/sendEmail');

// @desc    Create a new order
// @route   POST /api/orders/create
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod,
      paymentId,
      notes
    } = req.body;

    // Create order (orderNumber will be generated in pre-save hook)
    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod,
      paymentId,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'CONFIRMED',
      notes
    });

    // Save order - this triggers pre-save hook that generates orderNumber
    await order.save();

    console.log('📦 Order created:', order.orderNumber);
    console.log('📧 Customer email:', order.customerEmail);

    // Send response immediately - don't wait for emails
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      emailStatus: { customerEmailSent: 'pending', adminEmailSent: 'pending' }
    });

    // Send confirmation emails asynchronously (non-blocking)
    // This runs AFTER the response is sent to the user
    sendOrderEmails(order)
      .then(emailStatus => {
        console.log('📧 Email status:', emailStatus);
      })
      .catch(emailError => {
        console.error('⚠️ Email sending failed but order was created:', emailError);
      });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create order', 
      error: error.message 
    });
  }
};

// @desc    Get orders by user email
// @route   GET /api/orders/user/:email
// @access  Public
exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders', 
      error: error.message 
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch order', 
      error: error.message 
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    const updatedOrder = await order.save();
    
    res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update order', 
      error: error.message 
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders', 
      error: error.message 
    });
  }
};
