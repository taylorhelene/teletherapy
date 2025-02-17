import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { analyzeImage } from '../services/imageService';
import '../App.css';

const suggestions = [
  'A', 'B', 'C', '1', '2', '3', 'Dog', 'Cat', 'Apple', 'Tunda', 'Maji', 'Rafiki',
  'Hello', 'Jambo', 'Asante', 'Good job', 'Karibu', 'Nini hiki?'
];

const getRandomSuggestion = () => {
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const location = useLocation();
  const [feedback, setFeedback] = useState('');
  const [suggestion, setSuggestion] = useState(getRandomSuggestion());
  const [typedInput, setTypedInput] = useState('');

  useEffect(() => {
    let stream = null;
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error.message);
        alert('Unable to access webcam. Please ensure it is connected and try again.');
      }
    };

    if (location.pathname === '/webcam') {
      startWebcam();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [location.pathname]);

  const captureAndSubmitImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
    const formData = new FormData();
    formData.append('image', imageBlob);
    formData.append('expectedText', suggestion);

    try {
      const response = await analyzeImage(formData);
      setFeedback(response.feedback);
      readAloud(response.feedback);
      
      if (response.feedback.includes('Good writing')) {
        setSuggestion(getRandomSuggestion());
      }
    } catch (error) {
      console.error('Error analyzing image:', error.message);
      alert('Failed to analyze image. Please try again.');
    }
  };

  const handleTextSubmit = async () => {
    if (typedInput.toLowerCase() === suggestion.toLowerCase()) {
      setFeedback('Good writing! 👏');
      setSuggestion(getRandomSuggestion());
    } else {
      setFeedback('Try again! You can do it!');
    }
    readAloud(feedback);
  };

  const readAloud = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      alert('Speech Synthesis API not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    synth.speak(utterance);
  };

  return (
    <div className="webcam-container">
      <h2 className="title">Webcam Capture and Analysis</h2>
      <h4>Type or Write Down and Show on Camera : <strong>{suggestion}</strong></h4>
      <div className="webcam-box">
        <video ref={videoRef} autoPlay className="webcam-video"></video>
      </div>
      <button className="capture-button m-2" onClick={captureAndSubmitImage}>
        Capture & Analyze
      </button>
      <input
        type="text"
        placeholder="Type here..."
        value={typedInput}
        onChange={(e) => setTypedInput(e.target.value)}
        className='form-control inputwebcam'
      />
      <button className="submit-button" onClick={handleTextSubmit}>
        Submit
      </button>
      {feedback && <p className="feedback-text">Feedback: {feedback}</p>}
    </div>
  );
};

export default WebcamCapture;
