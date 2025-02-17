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
const analyzeImage = async (imageBuffer, expectedText) => {
  try {
    const analysis = await computerVisionClient.readInStream(imageBuffer);
    const operationLocation = analysis.operationLocation;
    const operationId = operationLocation.split('/').pop();

    let result;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = await computerVisionClient.getReadResult(operationId);
    } while (result.status === 'running');

    if (result.status === 'succeeded') {
      const extractedText = result.analyzeResult.readResults
        .map(page => page.lines.map(line => line.text).join(' '))
        .join(' ');
      
      const normalizedText = extractedText.toLowerCase().trim();
      const normalizedExpected = expectedText.toLowerCase().trim();

      const feedback = normalizedText === normalizedExpected
        ? 'Good writing! 👏'
        : normalizedText.includes('😊')
        ? 'Try harder! You can do it!'
        : 'Keep practicing! You are learning!';
      
      return { extractedText, feedback };
    }
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    throw new Error('Failed to analyze the image with Azure Computer Vision.');
  }
};


module.exports = { analyzeImage };
