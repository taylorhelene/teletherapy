const express = require('express');
const router = express.Router();
const { initiatePayment, paymentCallback, getPaymentStatus } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Initiate a payment
router.post('/', authMiddleware, initiatePayment);

// Handle payment callback
router.post('/callback', paymentCallback);

// Get payment status for a session
router.get('/:sessionId', authMiddleware, getPaymentStatus);

module.exports = router;
