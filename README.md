# Teletherapy Platform - AI-Powered Education & Therapy
This project is a teletherapy platform that integrates Azure OpenAI, Image Recognition, Animation for Engagement, and Escrow Payments to provide an interactive, AI-powered therapy and educational experience for children. The platform allows children with cognitive diabilities to engage in therapy sessions through video, analysis, feedback, and animated exercises. It also includes AI-generated personalized content and speech synthesis for feedback.

## Key Features

1. Azure OpenAI Chatbot for Interactive Therapy
The chatbot functions as a virtual therapist, providing emotional and cognitive exercises to children.
It uses Natural Language Processing (NLP) to adapt to the child's tone, mood, and learning progress in real-time.
2. Image Recognition for Real-Time Feedback
Uses Azure Computer Vision to analyze visual cues such as facial expressions, attention span, and engagement.
Evaluates activities like handwriting or drawing exercises and provides AI-powered feedback.
3. Animation for Engagement(yet to be implemented)
Custom animations guide children through exercises.
Visual storytelling teaches coping strategies for social challenges.
The platform uses video links for various animation resources.
4. Azure OpenAI for Adaptive Learning
Generates personalized content based on the child’s progress using AI.
Suggests tailored exercises, videos, or challenges, and includes multilingual support.
5. Escrow Payments for Trust & Accessibility
Families pay for sessions through escrow to ensure transparency and fairness.
Funds are released to therapists after successful sessions, verified by the AI system and parents' feedback.
The payment is 50ksh per evry fifty sessions. The first 50 sessions are free

## Tech Stack

Frontend: React.js
Backend: Node.js with Express.js
Database: MongoDB (for storing user data, session records)
AI Services: Azure OpenAI & Azure Computer Vision API
Payment Integration: Escrow-based system (Mpesa paypal)
Installation & Running the Project

Prerequisites
Node.js: Make sure you have Node.js installed (Version 14 or later).
MongoDB: If you're running locally, make sure you have MongoDB installed.
Azure Account: Set up an Azure account to access Azure Computer Vision and Azure OpenAI APIs.
API Keys: Obtain the necessary API keys for Azure and add them to the .env files.

Backend Setup

``` bash
cd teletherapy-platform
cd backend

npm install
```
Create a .env file in the backend/ folder with the following variables:
``` js
AZURE_CV_KEY=your_azure_computer_vision_key
AZURE_CV_ENDPOINT=your_azure_computer_vision_endpoint
MONGODB_URI=mongo atlas
```
Start the backend server:
```bash
npm start
The backend server will be running at http://localhost:5000.
```
Frontend Setup
Navigate to the frontend/ directory:
```bash
cd frontend
npm install
npm start
```
The frontend will be running at http://localhost:3000.

Running Together
Once both the backend and frontend are running, the platform can be accessed at http://localhost:3000, where the frontend connects to the backend to analyze webcam images, process the data through Azure APIs, and provide feedback.

Key Code Files
Backend:

server.js: Main entry point for backend services.
azureComputerVision.js: Contains logic for connecting to Azure Computer Vision API for image recognition.
controllers/feedbackController.js: Handles feedback logic and response after analyzing images.
models/user.js: Mongoose schema for storing user data (children, therapists).
routes/feedbackRoutes.js: API routes for feedback submission and analysis.
Frontend:

WebcamCapture.js: Captures the image from the webcam and submits it to the backend for analysis.
App.js: Main React component where the UI is rendered.
services/imageService.js: API service to call backend endpoints for image analysis.
WebcamCapture.css: CSS styles for the webcam capture interface.
API Integration
Azure Computer Vision API
This API is used for analyzing visual feedback such as facial expressions and attention span.
azureComputerVision.js: Integrates with the Azure Computer Vision API to process the captured webcam image and analyze it for feedback.
Azure OpenAI API
Used for generating personalized content and adaptive learning exercises based on the child's progress.
Integrates with Azure OpenAI to provide real-time chatbot responses.
Payment System:
Payment handling is implemented via an escrow system, ensuring fairness and transparency between parents and therapists.
This feature requires additional setup with payment service providers like Stripe or PayPal (not included in this demo version).

Folder Structure

```textfile

teletherapy-platform/
├── backend/                     # Node.js + Express.js (Backend API)
│   ├── config/                  # Config files (DB, Azure APIs)
│   ├── controllers/             # Controllers for handling requests
│   ├── models/                  # Mongoose models
│   ├── routes/                  # Express.js routes
│   ├── middlewares/             # Authentication, error handling
│   ├── utils/                   # Utility functions
│   ├── server.js                # Main entry point for backend
│   └── package.json             # Backend dependencies
├── frontend/                    # React.js (Frontend)
│   ├── public/                  # Static assets
│   ├── src/                     
│   │   ├── components/          # React components
│   │   ├── pages/               # React pages
│   │   ├── services/            # API service functions
│   │   ├── App.js               # Main app component
│   │   ├── index.js             # React entry point
│   └── package.json             # Frontend dependencies
├── README.md                    # Project documentation
└── .gitignore                   # Git ignore file
```
Troubleshooting
Webcam Not Working: Make sure your browser has permissions enabled to access the webcam.
API Integration: Double-check your Azure API keys and ensure they are correctly placed in the .env files for both frontend and backend.
Payment Integration: Payment is through mpesa, first 50 sessions are free.
License
This project is licensed under the MIT License - see the LICENSE file for details.

