const { ComputerVisionClient } = require('@azure/cognitiveservices-computervision');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');
const dotenv = require('dotenv');
dotenv.config();

// Initialize the Computer Vision Client
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({
    inHeader: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_COMPUTER_VISION_KEY },
  }),
  process.env.AZURE_COMPUTER_VISION_URL
);

/**
 * Analyze Image using Azure Computer Vision
 * @param {Buffer} imageBuffer - The image buffer to analyze
 * @returns {Object} Analysis results
 */
const analyzeImage = async (imageBuffer) => {
  try {
    // Supported features for analysis
    const visualFeatures = ['Categories', 'Description', 'Tags', 'Faces', 'Objects'];

    // Analyze the image
    const analysis = await computerVisionClient.analyzeImageInStream(imageBuffer, { visualFeatures });

    return analysis;
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    throw new Error('Failed to analyze the image with Azure Computer Vision.');
  }
};

module.exports = { analyzeImage };
