const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`👤 [Auth Login] POST /api/auth/login - Email: ${email}`);

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.warn(`⚠️ [Auth Login] User not found: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ [Auth Login] User found: ${user._id}`);
    const passwordMatch = await user.matchPassword(password);

    if (passwordMatch) {
      console.log(`✅ [Auth Login] Password match successful for ${email}`);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      console.warn(`⚠️ [Auth Login] Password mismatch for user: ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`❌ [Auth Login] Error: ${error.message}`);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    console.log(`📝 [Auth Register] POST /api/auth/register - Email: ${email}`);

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.warn(`⚠️ [Auth Register] User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }
        phone: updatedUser.phone,
    console.log(`✅ [Auth Register] Email is available, creating user: ${email}`);
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    });
        address: updatedUser.address,
    if (user) {
      console.log(`✅ [Auth Register] User created successfully: ${user._id}`);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      console.error('⚠️ [Auth Register] User creation returned falsy value');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(`❌ [Auth Register] Error: ${error.message}`);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
        role: updatedUser.role,
        token: generateToken(updatedUser._id, updatedUser.role)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
