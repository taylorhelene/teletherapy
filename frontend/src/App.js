import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HeroPage from './pages/HeroPage';
import WebcamCapture from './pages/WebcamCapture';
import TherapyPage from './pages/TherapyPage';
import Layout from './pages/Layout';  // Import the Layout component
import Learning from './pages/Learning';


function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap the routes with Layout that includes the navigation tabs */}
        <Route element={<Layout />}>
          <Route path="/webcam" element={<WebcamCapture />} />
          <Route path="/therapy" element={<TherapyPage />} />
          <Route path="/learning" element={<Learning />} />
        </Route>

        {/* Other routes without the navigation tabs */}
        <Route index path="/" element={<HeroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
