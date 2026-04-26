const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Debug: Log environment variable status at startup
console.log('🚀 Starting Ritzy Shop Backend...');
console.log('🔑 Environment Check:');
console.log('   - RESEND_API_KEY loaded:', !!process.env.RESEND_API_KEY);
console.log('   - FROM_EMAIL:', process.env.FROM_EMAIL || 'orders@ritzy24.com (default)');
console.log('   - ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'ritzy2233@gmail.com (default)');
console.log('   - MONGODB_URI loaded:', !!process.env.MONGODB_URI);
console.log('   - MONGO_URI loaded:', !!process.env.MONGO_URI);
console.log('   - FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');
console.log('   - PORT:', process.env.PORT || 5000);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ritzy24.com",
      "http://ritzy24.com",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ritzy Shop API is running' });
});

// Email test route - check if email is configured correctly (legacy)
app.get('/api/test-email', async (req, res) => {
  try {
    const { testEmailConnection } = require('./services/emailService');
    const result = await testEmailConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Email test failed'
    });
  }
});

// Resend email test route - check connection
app.get('/api/test-resend', async (req, res) => {
  try {
    const { testResendConnection } = require('./utils/sendEmail');
    const result = await testResendConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Resend test failed'
    });
  }
});

// Send actual test email - use: GET /api/send-test-email?to=your@email.com
app.get('/api/send-test-email', async (req, res) => {
  try {
    const { sendTestEmail } = require('./utils/sendEmail');
    const toEmail = req.query.to || process.env.ADMIN_EMAIL || 'ritzy2233@gmail.com';
    
    console.log('🔧 [Test] Sending test email to:', toEmail);
    const result = await sendTestEmail(toEmail);
    
    res.json({
      ...result,
      testedAt: new Date().toISOString(),
      envCheck: {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        FROM_EMAIL: process.env.FROM_EMAIL || 'orders@ritzy24.com (default)',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'ritzy2233@gmail.com (default)'
      }
    });
  } catch (error) {
    console.error('❌ [Test] Send test email failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Send test email failed'
    });
  }
});

// Root test route
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Ritzy Shop API is running successfully 🚀',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler - must be last
app.use((req, res) => {
  console.warn('404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.url,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
