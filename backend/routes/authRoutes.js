const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserDetails } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Register a new user
router.post('/register', registerUser);

// Login an existing user
router.post('/login', loginUser);

// Get logged-in user details
router.get('/me', authMiddleware, getUserDetails);

module.exports = router;
