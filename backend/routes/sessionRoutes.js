const express = require('express');
const router = express.Router();
const { getChatbotResponse, createSession, getSessions, getSessionById, updateSession,analyzeWebcamImage, getPersonalizedSuggestions} = require('../controllers/sessionController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer();
// Create a new session
router.post('/', authMiddleware, createSession);

// Get all sessions for a user
router.get('/', authMiddleware, getSessions);

// Get a specific session by ID
router.get('/:id', authMiddleware, getSessionById);

// Update a session's details
router.put('/:id', authMiddleware, updateSession);


router.post('/chatbot', getChatbotResponse);

router.post('/analyze', upload.single('image'), analyzeWebcamImage);
router.post('/suggestions', getPersonalizedSuggestions);

module.exports = router;
