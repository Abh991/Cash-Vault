import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import backgroundImage from '../Images/login.jpeg';
import axios from 'axios';

// Function to generate a unique UPI ID
const generateUpiId = (email) => {
  const emailPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''); // Sanitize email prefix
  return `${emailPrefix}@cashvault`;
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    identityType: '',
    identityNumber: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const handlePasswordToggle = () => setShowPassword(!showPassword);
  const handleConfirmPasswordToggle = () => setShowConfirmPassword(!showConfirmPassword);

  // Handle identity type change
  const handleIdentityChange = (e) => {
    setFormData({ ...formData, identityType: e.target.value, identityNumber: '' });
  };

  // Validate phone number
  const validatePhoneNumber = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber || !formData.identityType || !formData.identityNumber) {
      setError('All fields are required.');
      return;
    }

    // Validate phone number
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('Phone number must be 10 digits.');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');

    // Generate UPI ID using email
    const generatedUpiId = generateUpiId(formData.email);

    const userWithUpiId = { ...formData, upiId: generatedUpiId };

    try {
      const response = await axios.post('http://localhost:5001/register', userWithUpiId);

      if (response.status === 201) {
        // Save user data to localStorage
        localStorage.setItem('userInfo', JSON.stringify(userWithUpiId));

        alert('Registration successful!');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Please try again later.');
    }
  };

  return (
    <div className="register-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              aria-label="Full Name"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              aria-label="Email"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              aria-label="Phone Number"
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              aria-label="Password"
              required
            />
            <i
              className={`eye-icon ${showPassword ? 'show' : ''}`}
              onClick={handlePasswordToggle}
              aria-label="Toggle Password Visibility"
            >
              👁️
            </i>
          </div>
          <div className="input-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-label="Confirm Password"
              required
            />
            <i
              className={`eye-icon ${showConfirmPassword ? 'show' : ''}`}
              onClick={handleConfirmPasswordToggle}
              aria-label="Toggle Confirm Password Visibility"
            >
              👁️
            </i>
          </div>
          <div className="input-group">
            <select
              name="identityType"
              value={formData.identityType}
              onChange={handleIdentityChange}
              required
            >
              <option value="">Select Identity Type</option>
              <option value="Aadhar">Aadhar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="Passport">Passport</option>
            </select>
          </div>
          {formData.identityType && (
            <div className="input-group">
              <input
                type="text"
                name="identityNumber"
                placeholder={`Enter ${formData.identityType} Number`}
                value={formData.identityNumber}
                onChange={handleChange}
                aria-label={`${formData.identityType} Number`}
                required
              />
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
