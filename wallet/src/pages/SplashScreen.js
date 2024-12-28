import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';
import logoImage from '../Images/logo1.jpg'; // Adjust path based on your folder structure
import backgroundImage from '../Images/login.jpeg'; // Adjust path based on your folder structure

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to the login page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigate]);

  return (
    <div
      className="splash-container"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Set background image dynamically
    >
      <div className="logo-container">
        <img
          src={logoImage}
          alt="Logo"
          className="splash-logo"
        />
      </div>
      <div className="loading-spinner"></div> {/* Circular loading spinner */}
    </div>
  );
};

export default SplashScreen;
