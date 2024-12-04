import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      sessionStorage.setItem('userId', response.user._id);
      navigate('/home');
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="login-container">
      {/* Background Video */}
      <div className="video-background">
        <video className="background-video" loop autoPlay muted>
          <source src={process.env.PUBLIC_URL + '/signup.mp4'} type="video/mp4" />
        </video>
      </div>

      {/* Login Form */}
      <div className="login-form">
        <h1 className="text-center text-white">Login</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
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
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-info btn-lg">Log In</button>
          </div>
        </form>
        <div className="signin-link text-center mt-3">
          <p className="text-white">Don't have an account? <a href="/register" className="text-info">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
