import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Function to register a new user
export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, data);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error.response?.data || error.message);
        throw error;
    }
};

// Function to log in a user
export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error.response?.data || error.message);
        throw error;
    }
};

const getToken = () => {
  return localStorage.getItem('token'); // Or use sessionStorage
};

// Function to initiate a session
export const initiateSession = async (sessionData) => {
    const token = getToken(); // Get the token from localStorage (or any other source)

    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const response = await axios.post('http://localhost:5000/api/sessions', sessionData, {
            headers: {
                'Authorization': `Bearer ${token}` // Add token to headers
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error initiating session: ', error);
        throw error;
    }
};

// Function to get a list of sessions
export const getSessions = async () => {
    try {
        const response = await axios.get(`${API_URL}/sessions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error.response?.data || error.message);
        throw error;
    }
};

// Function to get chatbot response for a session
export const getChatbotResponse = async (message) => {
    try {
        const response = await axios.post(`${API_URL}/sessions/chatbot`, { message });
        return response.data.response;
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        throw error;
    }
};

// Function to process a payment
export const processPayment = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/payments`, data);
        return response.data;
    } catch (error) {
        console.error('Error processing payment:', error.response?.data || error.message);
        throw error;
    }
};

// Function to get payment status
export const getPaymentStatus = async (sessionId) => {
    try {
        const response = await axios.get(`${API_URL}/payments/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment status:', error.response?.data || error.message);
        throw error;
    }
};

// Proceed to payment
export const proceedToPayment = async ({ sessionId, amount, phoneNumber, userId}) => {
    const token = getToken(); // Get the token from localStorage (or any other source)

    if (!token) {
        throw new Error('No token provided');
    }

    try {
        let response = await axios.post(`${API_URL}/payments`, { sessionId, amount, phoneNumber,userId },
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to headers
                }
            }
        )

        console.log(response)

        return response.data
        

    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    } 

    
};


// Proceed to payment
export const completePayment = async ({ sessionId, amount, phoneNumber, userId}) => {
    const token = getToken(); // Get the token from localStorage (or any other source)

    if (!token) {
        throw new Error('No token provided');
    }

    try {
        // Wait for 7 seconds before proceeding
        await new Promise((resolve) => setTimeout(resolve, 15000));

        // Call the payment callback endpoint
        const response = await axios.post(
            `${API_URL}/payments/callback`,
            { sessionId, amount, phoneNumber, userId},
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to headers
                }
            }
        );
        console.log(response.data)
        return response.data; // Return response data
    } catch (error) {
        console.error('Error completing payment:', error);
        throw error;
    }
};
// Function to capture and analyze image
export const captureAndAnalyzeImage = async (imageData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/sessions/analyzeImage', { image: imageData });
      return response.data.feedback; // This feedback will be the text read aloud
    } catch (error) {
      console.error('Error capturing and analyzing image:', error);
      return 'Error analyzing image, please try again.'; // Default message if there's an error
    }
  };