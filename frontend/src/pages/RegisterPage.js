import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService'; // Ensure this function is available for handling registration
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await registerUser({ name, email, password });
      localStorage.setItem('token', response.token);
      sessionStorage.setItem('userId', response.user._id);
      navigate('/home');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      {/* Background Video */}
      <div className="video-background">
        <DotLottieReact
          src={process.env.PUBLIC_URL + '/login.json'}
          loop
          autoplay
          className="background-video"/>
      </div>

      {/* Registration Form */}
      <div className="register-form">
        <h1 className="text-center text-white">Sign Up</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control rounded"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control rounded"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control rounded"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control rounded"
              required
            />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className=" btn-info rounded-pill">Sign Up</button>
          </div>
        </form>
        <div className="signin-link text-center mt-3">
          <p className="text-white">Already have an account? <a href="/login" className="text-info">Log In</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
