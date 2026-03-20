const { Resend } = require('resend');

// Lazy initialization - Resend client created only when needed
// This ensures environment variables are loaded before initialization
let resendClient = null;

const getResendClient = () => {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 [Resend] Initializing client...');
    console.log('🔑 [Resend] API Key exists:', !!apiKey);
    console.log('🔑 [Resend] API Key length:', apiKey ? apiKey.length : 0);
    console.log('🔑 [Resend] API Key prefix:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
    
    if (!apiKey) {
      console.error('❌ [Resend] RESEND_API_KEY is not set in environment variables!');
      return null;
    }
    
    resendClient = new Resend(apiKey);
    console.log('✅ [Resend] Client initialized successfully');
  }
  return resendClient;
};

// Admin email for notifications
const getAdminEmail = () => process.env.ADMIN_EMAIL || 'ritzy2233@gmail.com';

// IMPORTANT: FROM_EMAIL must match your verified domain in Resend
// For verified domain ritzy24.com, use: orders@ritzy24.com
const getFromEmail = () => process.env.FROM_EMAIL || 'orders@ritzy24.com';

/**
 * Send order confirmation email to customer
 * @param {string} userEmail - Customer's email address
 * @param {Object} orderDetails - Order details object
 * @returns {Promise<boolean>} - Success status
 */
const sendOrderEmail = async (userEmail, orderDetails) => {
  console.log('📧 [Resend] Preparing to send email to customer:', userEmail);
  
  if (!userEmail) {
    console.error('❌ [Resend] No customer email provided');
    return false;
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ [Resend] RESEND_API_KEY is not configured');
    return false;
  }

  const orderNum = orderDetails.orderNumber || orderDetails._id?.toString().slice(-8).toUpperCase() || 'N/A';
  
  const itemsList = orderDetails.items.map(item => 
    `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
    </tr>`
  ).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF2A0A, #C81D00); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0; opacity: 0.95; }
        .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 13px; color: #666; border: 1px solid #e0e0e0; border-top: none; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #FF2A0A; color: white; padding: 12px; text-align: left; }
        .total { font-size: 1.3em; font-weight: bold; color: #FF2A0A; margin: 20px 0; }
        .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
        .badge-cod { background: #28a745; color: white; }
        .badge-paid { background: #17a2b8; color: white; }
        .address-box { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #FF2A0A; }
        .order-number { background: #fff3cd; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .order-number span { font-size: 24px; font-weight: bold; color: #FF2A0A; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for shopping with Ritzy</p>
          <p style="font-size: 12px; opacity: 0.8;">A unit of Aadibasaveshwara Enterprises</p>
        </div>
        <div class="content">
          <p>Dear <strong>${orderDetails.customerName}</strong>,</p>
          <p>Great news! Your order has been successfully placed and confirmed. Here are your order details:</p>
          
          <div class="order-number">
            <p style="margin: 0 0 5px; color: #666;">Order Number</p>
            <span>#${orderNum}</span>
          </div>
          
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
          
          <p class="total">Total Amount: ₹${orderDetails.totalAmount}</p>
          
          <p><strong>Payment Method:</strong> 
            <span class="badge ${orderDetails.paymentMethod === 'COD' ? 'badge-cod' : 'badge-paid'}">
              ${orderDetails.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 ' + orderDetails.paymentMethod}
            </span>
          </p>
          
          <h3>📍 Delivery Address</h3>
          <div class="address-box">
            <p style="margin: 0;">${orderDetails.shippingAddress}</p>
            <p style="margin: 10px 0 0;"><strong>📞</strong> ${orderDetails.customerPhone}</p>
          </div>
          
          ${orderDetails.paymentMethod === 'COD' ? 
            '<p style="background: #fff3cd; padding: 12px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 20px;">⚠️ Please keep <strong>₹' + orderDetails.totalAmount + '</strong> ready for payment at the time of delivery.</p>' 
            : ''
          }
          
          <p style="margin-top: 25px;">We will notify you once your order is shipped. Thank you for choosing Ritzy! 🙏</p>
        </div>
        <div class="footer">
          <p>If you have any questions, contact us at ${getAdminEmail()}</p>
          <p style="margin: 10px 0 0;">© ${new Date().getFullYear()} Ritzy - Aadibasaveshwara Enterprises. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const resend = getResendClient();
    if (!resend) {
      console.error('❌ [Resend] Client not initialized - check RESEND_API_KEY');
      return false;
    }

    const fromEmail = getFromEmail();
    console.log('📧 [Resend] Sending from:', fromEmail);
    console.log('📧 [Resend] Sending to:', userEmail);

    const { data, error } = await resend.emails.send({
      from: `Ritzy Shop <${fromEmail}>`,
      to: [userEmail],
      subject: `Order Confirmed! #${orderNum} - Ritzy Shop`,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ [Resend] Failed to send customer email:', error);
      return false;
    }

    console.log('✅ [Resend] Customer email sent successfully! ID:', data?.id);
    return true;
  } catch (error) {
    console.error('❌ [Resend] Error sending customer email:', error.message);
    return false;
  }
};

/**
 * Send order notification email to admin
 * @param {Object} orderDetails - Order details object
 * @returns {Promise<boolean>} - Success status
 */
const sendAdminNotification = async (orderDetails) => {
  console.log('📧 [Resend] Preparing to send notification to admin');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ [Resend] RESEND_API_KEY is not configured');
    return false;
  }

  const orderNum = orderDetails.orderNumber || orderDetails._id?.toString().slice(-8).toUpperCase() || 'N/A';
  
  const itemsList = orderDetails.items.map(item => 
    `<tr>
      <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${item.price}</td>
    </tr>`
  ).join('');

  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 25px; border: 1px solid #ddd; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #333; color: white; padding: 10px; text-align: left; }
        .highlight { background: #fffbcc; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .customer-info { background: #f0f0f0; padding: 15px; border-radius: 8px; }
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
            <strong>💰 Order Value: ₹${orderDetails.totalAmount}</strong> &nbsp;|&nbsp; 
            <strong>Payment: ${orderDetails.paymentMethod}</strong>
          </div>
          
          <h3>👤 Customer Details</h3>
          <div class="customer-info">
            <p><strong>Name:</strong> ${orderDetails.customerName}</p>
            <p><strong>Email:</strong> ${orderDetails.customerEmail}</p>
            <p><strong>Phone:</strong> ${orderDetails.customerPhone}</p>
          </div>
          
          <h3>📦 Order Items</h3>
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
          
          <h3>📍 Delivery Address</h3>
          <p style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
            ${orderDetails.shippingAddress}
          </p>
          
          ${orderDetails.notes ? `<p><strong>Notes:</strong> ${orderDetails.notes}</p>` : ''}
          
          <p><strong>Order Time:</strong> ${new Date(orderDetails.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
        <div class="footer">
          <p>This is an automated notification from Ritzy Shop</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const resend = getResendClient();
    if (!resend) {
      console.error('❌ [Resend] Client not initialized - check RESEND_API_KEY');
      return false;
    }

    const fromEmail = getFromEmail();
    const adminEmail = getAdminEmail();
    console.log('📧 [Resend] Sending admin notification from:', fromEmail);
    console.log('📧 [Resend] Sending admin notification to:', adminEmail);

    const { data, error } = await resend.emails.send({
      from: `Ritzy Shop System <${fromEmail}>`,
      to: [adminEmail],
      subject: `🛒 New Order #${orderNum} - ₹${orderDetails.totalAmount}`,
      html: adminEmailHtml,
    });

    if (error) {
      console.error('❌ [Resend] Failed to send admin notification:', error);
      return false;
    }

    console.log('✅ [Resend] Admin notification sent successfully! ID:', data?.id);
    return true;
  } catch (error) {
    console.error('❌ [Resend] Error sending admin notification:', error.message);
    return false;
  }
};

/**
 * Send both customer and admin emails for an order
 * @param {Object} order - Order object from database
 * @returns {Promise<Object>} - Status of both emails
 */
const sendOrderEmails = async (order) => {
  console.log('📧 [Resend] Starting to send order emails for:', order.orderNumber);
  
  let customerEmailSent = false;
  let adminEmailSent = false;

  try {
    customerEmailSent = await sendOrderEmail(order.customerEmail, order);
  } catch (error) {
    console.error('❌ [Resend] Customer email failed:', error.message);
  }

  try {
    adminEmailSent = await sendAdminNotification(order);
  } catch (error) {
    console.error('❌ [Resend] Admin email failed:', error.message);
  }

  console.log('📧 [Resend] Email results - Customer:', customerEmailSent, 'Admin:', adminEmailSent);

  return {
    customerEmailSent,
    adminEmailSent
  };
};

/**
 * Test Resend connection
 * @returns {Promise<Object>} - Test result
 */
const testResendConnection = async () => {
  console.log('📧 [Resend] Testing connection...');
  console.log('🔑 [Resend] API Key exists:', !!process.env.RESEND_API_KEY);
  console.log('🔑 [Resend] FROM_EMAIL:', getFromEmail());
  console.log('🔑 [Resend] ADMIN_EMAIL:', getAdminEmail());
  
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      message: 'RESEND_API_KEY is not configured in environment variables',
      apiKeyConfigured: false,
      fromEmail: getFromEmail(),
      adminEmail: getAdminEmail()
    };
  }

  try {
    const resend = getResendClient();
    if (!resend) {
      return {
        success: false,
        message: 'Failed to initialize Resend client',
        apiKeyConfigured: false
      };
    }

    // Try to get domains to verify API key works
    const { data, error } = await resend.domains.list();
    
    if (error) {
      return {
        success: false,
        message: `API key validation failed: ${error.message}`,
        apiKeyConfigured: true,
        error: error
      };
    }

    return {
      success: true,
      message: 'Resend connection successful!',
      apiKeyConfigured: true,
      domains: data?.data?.length || 0,
      domainList: data?.data?.map(d => d.name) || [],
      fromEmail: getFromEmail(),
      adminEmail: getAdminEmail()
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection test failed: ${error.message}`,
      apiKeyConfigured: true,
      error: error.message
    };
  }
};

/**
 * Send a test email to verify configuration works
 * @param {string} toEmail - Email address to send test to
 * @returns {Promise<Object>} - Test result with full details
 */
const sendTestEmail = async (toEmail) => {
  console.log('📧 [Resend] Sending test email to:', toEmail);
  console.log('🔑 [Resend] API Key exists:', !!process.env.RESEND_API_KEY);
  
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      message: 'RESEND_API_KEY is not configured',
      step: 'api_key_check'
    };
  }

  const resend = getResendClient();
  if (!resend) {
    return {
      success: false,
      message: 'Failed to initialize Resend client',
      step: 'client_init'
    };
  }

  const fromEmail = getFromEmail();
  console.log('📧 [Resend] Sending from:', fromEmail);

  try {
    const { data, error } = await resend.emails.send({
      from: `Ritzy Shop Test <${fromEmail}>`,
      to: [toEmail],
      subject: 'Test Email from Ritzy Shop - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF2A0A;">Test Email Successful!</h1>
          <p>This is a test email from Ritzy Shop backend.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <p><strong>From:</strong> ${fromEmail}</p>
          <p><strong>To:</strong> ${toEmail}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">If you received this email, your Resend configuration is working correctly!</p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ [Resend] Test email failed:', JSON.stringify(error, null, 2));
      return {
        success: false,
        message: 'Failed to send test email',
        error: error,
        step: 'send_email',
        fromEmail: fromEmail,
        toEmail: toEmail
      };
    }

    console.log('✅ [Resend] Test email sent! Response:', JSON.stringify(data, null, 2));
    return {
      success: true,
      message: 'Test email sent successfully!',
      emailId: data?.id,
      fromEmail: fromEmail,
      toEmail: toEmail
    };
  } catch (error) {
    console.error('❌ [Resend] Test email exception:', error.message);
    return {
      success: false,
      message: `Exception: ${error.message}`,
      step: 'exception',
      fromEmail: fromEmail,
      toEmail: toEmail
    };
  }
};

module.exports = {
  sendOrderEmail,
  sendAdminNotification,
  sendOrderEmails,
  testResendConnection,
  sendTestEmail,
  getResendClient,
  getFromEmail,
  getAdminEmail
};
