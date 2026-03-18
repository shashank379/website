const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const promoteUserToAdmin = async () => {
  try {
    const email = process.argv[2];

    if (!email) {
      throw new Error('Usage: node makeAdmin.js <admin_email>');
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      throw new Error(`User not found for email: ${email}`);
    }

    user.role = 'admin';
    await user.save();

    console.log(`User ${user.email} promoted to admin successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Promote admin error:', error.message);
    process.exit(1);
  }
};

promoteUserToAdmin();
