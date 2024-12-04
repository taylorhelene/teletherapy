const Session = require('../models/Session');
const Payment = require('../models/Payment');
const { initiatePayment } = require('../controllers/paymentController'); // Import payment controller function

const axios =require('axios')
// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { userId, duration } = req.body;

    // Fetch all sessions for the user
    const sessions = await Session.find({ userId });

    // Calculate the total session count and the number of paid sessions
    let totalSessionCount = 0;
    let paidSessionCount = 0;

    // Loop through all the sessions to calculate total and paid session counts
    sessions.forEach((session) => {
      totalSessionCount += session.sessionCount;  // Add the session count of each session
      if (session.paid) {
        paidSessionCount += session.sessionCount;  // Count paid sessions
      }
    });


    // If the user has no sessions, create the first session
    if (totalSessionCount === 0) {
      const session = await Session.create({
        userId: req.user.id,
        sessionType: "therapy",
        startDate: new Date(),
        duration,
        sessionCount: 1,  // Start with session count 1
        status: 'Pending',
        paid: false,  // First session, not paid
      });
      return res.status(201).json({ success: true, session });
    } else {
      // If total sessions > 50, check if the user has paid for the next batch of 50 sessions
      if (totalSessionCount > 50) {

        let calculate =  totalSessionCount - (paidSessionCount * 50)
        console.log(totalSessionCount, paidSessionCount, calculate)

        if (calculate < 50 ) {
          // If the user has paid for the next batch of 50 sessions, continue with the session
          const session = new Session({
            userId: req.user.id,
            sessionType: "therapy",
            startDate: new Date(),
            sessionCount: 1, // New session starts with count 1
            duration,
            status: 'Pending',
            paid: false,  // Mark the new session as paid
          });
          await session.save();
          return res.status(200).json({
            message: 'Session started. You have paid for the next 50 sessions.',
            sessionId: session._id,  // Return the session ID
            session,
          });
        } else {
          // If the user hasn't paid for the next set of sessions, prompt for payment
          const session = new Session({
            userId: req.user.id,
            sessionType: "therapy",
            startDate: new Date(),
            sessionCount: 1, // New session starts with count 1
            duration,
            status: 'Pending',
            paid: false, // Mark the new session as unpaid
          });
          await session.save();
          return res.status(200).json({
            message: 'You have reached the free session limit. Please make a payment to continue.',
            sessionId: session._id,
            redirectToPayment: true,  // Signal frontend to show the payment page
          });
        }
      } else {
        // If the session count is <= 50, continue without payment
        const session = new Session({
          userId: req.user.id,
          sessionType: "therapy",
          startDate: new Date(),
          sessionCount: 1,  // New session starts with count 1
          duration,
          status: 'Pending',
          paid: false,  // Mark the new session as unpaid
        });
        await session.save();
        return res.status(200).json({
          message: 'Session started successfully',
          sessionId: session._id,
          session,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all sessions for the logged-in user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id });
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a session's details
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to get chatbot response
exports.getChatbotResponse = async (req, res) => {
  const { message, sessionId } = req.body;

  try {

      const azureEndpoint = process.env.AZURE_OPENAI_API_URL;
      const azureApiKey = process.env.AZURE_API_KEY;

      // Send request to Azure OpenAI
      const response = await axios.post(
          azureEndpoint,
          {
              messages: [{ role: 'user', content: `You are a virtual therapist guiding a child through cognitive exercises. The child's input is: "${message}". Respond in a supportive and encouraging tone, appropriate for a child.` }],
              max_tokens: 200,
              temperature: 0.7,
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'api-key': azureApiKey,
              },
          }
      );

      const botResponse = response.data.choices[0].message.content;

      // Respond to frontend
      res.status(200).json({ response: botResponse });
  } catch (error) {
      console.error('Error fetching chatbot response:', error.message);
      res.status(500).json({ error: 'Error fetching chatbot response' });
  }
};

// Proceed to payment if sessions exceed the free limit
exports.proceedToPayment = async (req, res) => {
  const { sessionId, amount, phoneNumber } = req.body;

  try {
      // Find the session to ensure it's the right one
      const session = await Session.findById(sessionId);

      if (!session || session.sessionCount <= 50) {
          return res.status(400).json({ message: 'Invalid session for payment' });
      }

      // Call payment controller to initiate payment
      await initiatePayment(req, res);  // Use the already defined payment initiation logic
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing payment', error });
  }
};

const { analyzeImage } = require('../utils/azureComputerVision');

exports.analyzeWebcamImage = async (req, res) => {
  try {
    const imageBuffer = req.file.buffer; // Retrieve the image buffer from Multer
    const analysis = await analyzeImage(imageBuffer);

    // Extract relevant feedback
    const categories = analysis.categories.map((cat) => cat.name);
    const feedback = categories.includes('attention')
      ? 'Great focus! Keep going!'
      : 'Try to focus on the exercise. You can do this!';

    res.json({ analysis, feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const azureApiCall = require('../utils/azureApi');

exports.getPersonalizedSuggestions = async (req, res) => {
  const { progressData } = req.body;
  try {
    const prompt = `Based on this child's progress: ${JSON.stringify(
      progressData
    )}, suggest an educational exercise or video.`;
    const suggestion = await azureApiCall(prompt);

    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
