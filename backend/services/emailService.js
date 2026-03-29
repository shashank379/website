const nodemailer = require('nodemailer');

// Store transporter instance for reuse
let transporter = null;
let transporterVerified = false;

// Create transporter with email configuration and timeout
const createTransporter = () => {
  console.log('📧 Creating email transporter...');
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
  console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER or EMAIL_PASS environment variables are not set!');
    return null;
  }
  
  // Using explicit Gmail SMTP settings for better compatibility
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use App Password for Gmail (not regular password)
    },
    // Add timeouts for production - prevents hanging connections
    connectionTimeout: 10000, // 10 seconds to establish connection
    greetingTimeout: 10000,   // 10 seconds for greeting
    socketTimeout: 15000,     // 15 seconds for socket operations
    // Additional settings for cloud environments
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    },
    // Debug settings
    logger: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production'
  });
};

// Verify transporter connection
const verifyTransporter = async () => {
  try {
    if (!transporter) {
      transporter = createTransporter();
    }
    
    if (!transporter) {
      console.error('❌ Could not create email transporter - missing credentials');
      return false;
    }
    
    console.log('📧 Verifying email transporter connection...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully!');
    transporterVerified = true;
    return true;
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.error('📧 Full error:', JSON.stringify(error, null, 2));
    transporterVerified = false;
    return false;
  }
};

// Get or create verified transporter
const getTransporter = async () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  
  if (!transporterVerified) {
    await verifyTransporter();
  }
  
  return transporter;
};

// Send order confirmation email to customer
const sendOrderConfirmationToCustomer = async (order) => {
  console.log('📧 Preparing to send email to customer:', order.customerEmail);
  
  if (!order.customerEmail) {
    console.error('❌ No customer email provided in order');
    return false;
  }

  try {
    const emailTransporter = await getTransporter();
    
    if (!emailTransporter) {
      console.error('❌ Email transporter not available - check EMAIL_USER and EMAIL_PASS env variables');
      return false;
    }
  
    // Use order._id if orderNumber is not available
    const orderNum = order.orderNumber || order._id?.toString().slice(-8).toUpperCase() || 'N/A';
  
  const itemsList = order.items.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: `"Ritzy Shop" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `Order Confirmed! #${orderNum}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF2A0A, #C81D00); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 20px; border: 1px solid #ddd; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #FF2A0A; color: white; padding: 10px; text-align: left; }
          .total { font-size: 1.2em; font-weight: bold; color: #FF2A0A; }
          .badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .badge-cod { background: #28a745; color: white; }
          .badge-paid { background: #17a2b8; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for shopping with Ritzy Shop</p>
          </div>
          <div class="content">
            <p>Dear <strong>${order.customerName}</strong>,</p>
            <p>Your order has been successfully placed! Here are your order details:</p>
            
            <h3>Order Number: <span style="color: #FF2A0A;">${orderNum}</span></h3>
            
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <p class="total">Total Amount: ₹${order.totalAmount}</p>
            
            <p><strong>Payment Method:</strong> 
              <span class="badge ${order.paymentMethod === 'COD' ? 'badge-cod' : 'badge-paid'}">
                ${order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 ' + order.paymentMethod}
              </span>
            </p>
            
            <h3>📍 Delivery Address:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
              ${order.shippingAddress}
            </p>
            
            <p>📞 Contact: ${order.customerPhone}</p>
            
            ${order.paymentMethod === 'COD' ? 
              '<p style="background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">⚠️ Please keep ₹' + order.totalAmount + ' ready for payment at the time of delivery.</p>' 
              : ''
            }
            
            <p>We will notify you once your order is shipped.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, contact us at ${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}</p>
            <p>© ${new Date().getFullYear()} Ritzy Shop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to customer:', order.customerEmail);
    console.log('📧 Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email to customer:', error.message);
    console.error('📧 Error code:', error.code);
    console.error('📧 Full error:', JSON.stringify(error, null, 2));
    return false;
  }
};

// Send new order notification to admin
const sendOrderNotificationToAdmin = async (order) => {
  console.log('📧 Preparing to send notification to admin');
  
  try {
    const emailTransporter = await getTransporter();
    
    if (!emailTransporter) {
      console.error('❌ Email transporter not available for admin notification');
      return false;
    }
  
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const orderNum = order.orderNumber || order._id?.toString().slice(-8).toUpperCase() || 'N/A';
  
    const itemsList = order.items.map(item => 
      `<tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price}</td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: `"Ritzy Shop System" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🛒 New Order Received! #${orderNum} - ₹${order.totalAmount}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 20px; border: 1px solid #ddd; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #333; color: white; padding: 10px; text-align: left; }
          .highlight { background: #fffbcc; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 New Order Received!</h1>
            <p>Order #${orderNum}</p>
          </div>
          <div class="content">
            <div class="highlight">
              <strong>💰 Order Value: ₹${order.totalAmount}</strong> | 
              <strong>Payment: ${order.paymentMethod}</strong>
            </div>
            
            <h3>👤 Customer Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${order.customerName}</li>
              <li><strong>Email:</strong> ${order.customerEmail}</li>
              <li><strong>Phone:</strong> ${order.customerPhone}</li>
            </ul>
            
            <h3>📦 Order Items:</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <h3>📍 Delivery Address:</h3>
            <p style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
              ${order.shippingAddress}
            </p>
            
            ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
            
            <p><strong>Order Time:</strong> ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from Ritzy Shop</p>
          </div>
        </div>
      </body>
      </html>
    `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Order notification email sent to admin:', adminEmail);
    console.log('📧 Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email to admin:', error.message);
    console.error('📧 Error code:', error.code);
    console.error('📧 Full error:', JSON.stringify(error, null, 2));
    return false;
  }
};

// Send both emails with error handling
const sendOrderEmails = async (order) => {
  console.log('📧 Starting to send order emails for order:', order.orderNumber);
  
  let customerResult = false;
  let adminResult = false;
  
  try {
    customerResult = await sendOrderConfirmationToCustomer(order);
  } catch (error) {
    console.error('❌ Customer email failed:', error.message);
  }
  
  try {
    adminResult = await sendOrderNotificationToAdmin(order);
  } catch (error) {
    console.error('❌ Admin email failed:', error.message);
  }
  
  console.log('📧 Email results - Customer:', customerResult, 'Admin:', adminResult);
  
  return {
    customerEmailSent: customerResult,
    adminEmailSent: adminResult
  };
};

// Test email function - can be called from an API endpoint
const testEmailConnection = async () => {
  console.log('📧 Testing email connection...');
  const verified = await verifyTransporter();
  return {
    success: verified,
    emailUser: process.env.EMAIL_USER || 'NOT SET',
    emailPassConfigured: !!process.env.EMAIL_PASS,
    message: verified ? 'Email connection successful!' : 'Email connection failed - check logs'
  };
};

module.exports = {
  sendOrderConfirmationToCustomer,
  sendOrderNotificationToAdmin,
  sendOrderEmails,
  testEmailConnection,
  verifyTransporter
};
