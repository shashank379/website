/**
 * Test Email Configuration
 * Run this script to verify your email setup: node test-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('🔧 Testing email configuration...\n');
  
  // Check if environment variables are set
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.error('❌ ERROR: EMAIL_USER is not configured in .env file');
    console.log('\nPlease update your .env file with:');
    console.log('EMAIL_USER=your_actual_email@gmail.com');
    console.log('EMAIL_PASS=your_app_password');
    return;
  }
  
  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password_here') {
    console.error('❌ ERROR: EMAIL_PASS is not configured in .env file');
    console.log('\n📝 How to get Gmail App Password:');
    console.log('1. Go to https://myaccount.google.com/security');
    console.log('2. Enable 2-Step Verification (required)');
    console.log('3. Go to https://myaccount.google.com/apppasswords');
    console.log('4. Create a new app password for "Mail"');
    console.log('5. Copy the 16-character password to EMAIL_PASS in .env');
    return;
  }

  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('📧 Admin Email:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
  console.log('');

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.log('\n🔍 Common issues:');
    console.log('1. Wrong email/password');
    console.log('2. 2-Step Verification not enabled');
    console.log('3. App Password not being used (regular password won\'t work)');
    console.log('4. "Less secure app access" is not the solution - use App Passwords');
    return;
  }

  // Send test email
  console.log('📤 Sending test email...');
  
  const testEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  try {
    const info = await transporter.sendMail({
      from: `"Ritzy Shop Test" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: '✅ Ritzy Shop Email Test - Configuration Working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF2A0A, #C81D00); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>🎉 Email Configuration Successful!</h1>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <p>Your email configuration is working correctly.</p>
            <p>Order confirmation emails will now be sent to customers and admin.</p>
            <hr>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Email User: ${process.env.EMAIL_USER}</li>
              <li>Test Time: ${new Date().toLocaleString()}</li>
            </ul>
          </div>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log(`\n📥 Check your inbox at: ${testEmail}`);
    
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
  }
}

testEmail();
