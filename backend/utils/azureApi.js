const axios = require('axios');

const azureApiCall = async (prompt) => {
  const response = await axios.post(
    process.env.AZURE_OPENAI_API_URL,
    { prompt, max_tokens: 100 },
    { headers: { 'api-key': process.env.AZURE_API_KEY } }
  );
  return response.data.choices[0].text.trim();
};

module.exports = azureApiCall;
