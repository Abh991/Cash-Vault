import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';
import backgroundImage from '../Images/login.jpeg'; 
import axios from 'axios'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if both fields are filled
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    
    try {
      // Send the login request to the backend
      const response = await axios.post('http://localhost:5001/login', formData);

      // Check if the response is successful
      if (response.status === 200) {
        // Save the JWT token to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user info

        alert('Login successful!');
        
        // Redirect to the home page after successful login
        navigate('/home');
      }
    } catch (error) {
      // Handle errors based on the response
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Something went wrong. Please try again.');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="/" className="forgot-password">
              Forgot Password
            </a>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
        <p className="register-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
