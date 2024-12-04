import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sessions';

export const analyzeImage = async (formData) => {
  const response = await axios.post(`${API_URL}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
