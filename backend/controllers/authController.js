const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../config/db'); 
var salt = bcrypt.genSaltSync(10);


// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token ,user});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get logged-in user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
