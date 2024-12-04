import React, { useRef, useEffect, useState } from 'react';
import { analyzeImage } from '../services/imageService';
import '../App.css'; // Import external CSS file

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing webcam:', error.message);
        alert('Unable to access webcam. Please ensure it is connected and try again.');
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

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

    try {
      const response = await analyzeImage(formData);
      setFeedback(response.feedback);
      readAloud(response.feedback);
    } catch (error) {
      console.error('Error analyzing image:', error.message);
      alert('Failed to analyze image. Please try again.');
    }
  };

  const readAloud = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      alert('Speech Synthesis API not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Language setting
    utterance.rate = 1; // Speed of the speech
    synth.speak(utterance);
  };

  return (
    <div className="webcam-container">
      <h1 className="title">Webcam Capture and Analysis</h1>
      <div className="webcam-box">
        <video ref={videoRef} autoPlay className="webcam-video"></video>
      </div>
      <button className="capture-button" onClick={captureAndSubmitImage}>
        Capture & Analyze
      </button>
      {feedback && <p className="feedback-text">Feedback: {feedback}</p>}
    </div>
  );
};

export default WebcamCapture;
