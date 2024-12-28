import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '', upiId: '', id: '' }); // Assume `id` uniquely identifies the user
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [newUpiId, setNewUpiId] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from local storage
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
      setNewUpiId(storedUserInfo.upiId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleUpiEdit = () => {
    setIsEditingUpi(true);
  };

  const handleUpiSave = () => {
    if (newUpiId) {
      const updatedUserInfo = { ...userInfo, upiId: newUpiId };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setIsEditingUpi(false);
    } else {
      alert('Please enter a valid UPI ID');
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    try {
      // API call to update the password in the database
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.id, // Use unique user ID to identify the record
          newPassword,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          alert('Password updated successfully!');
          setIsChangingPassword(false);
          setNewPassword('');
          setConfirmPassword('');
        } else {
          alert(result.message || 'Failed to update the password.');
        }
      } else {
        throw new Error('Failed to update the password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const navigateToPage = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page-container">
      {/* Top Bar with Centered App Name */}
      <div className="top-bar">
        <h1 className="app-name">Cash Vault</h1>
        {/* Settings Button */}
        <button className="settings-button" onClick={toggleSettings}>
          ⚙️
        </button>
        {/* Settings Dropdown Menu */}
        {isSettingsOpen && (
          <div className="settings-menu">
            <button
              onClick={() => navigateToPage('/register')}
              className="settings-option"
            >
              Create New Account
            </button>
            {!isEditingUpi ? (
              <button onClick={handleUpiEdit} className="settings-option">
                Edit UPI ID
              </button>
            ) : (
              <button onClick={handleUpiSave} className="settings-option">
                Save UPI ID
              </button>
            )}
            <button
              onClick={() => setIsChangingPassword(true)}
              className="settings-option"
            >
              Change Password
            </button>
            <button onClick={handleLogout} className="settings-option">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* User Information and Options Section */}
      <div className="user-info-container">
        <div className="user-info">
          <h2>Welcome, {userInfo.name || 'User'}</h2>
          <p>Email: {userInfo.email || 'Not available'}</p>

          {/* UPI ID Section */}
          <p>
            UPI ID:{' '}
            {isEditingUpi ? (
              <input
                type="text"
                value={newUpiId}
                onChange={(e) => setNewUpiId(e.target.value)}
                placeholder="Enter UPI ID"
              />
            ) : (
              userInfo.upiId || 'Not assigned'
            )}
          </p>
        </div>

        {/* Vertically Aligned User Action Options */}
        <div className="user-options">
          <div
            className="option-card"
            onClick={() => navigateToPage('/send-money')}
          >
            <i className="option-icon">💸</i>
            <p className="option-text">Send Money</p>
          </div>
          <div
            className="option-card"
            onClick={() => navigateToPage('/transaction-history')}
          >
            <i className="option-icon">📜</i>
            <p className="option-text">Transaction</p>
          </div>
          <div
            className="option-card"
            onClick={() => navigateToPage('/requests')}
          >
            <i className="option-icon">📩</i>
            <p className="option-text">Requests</p>
          </div>
          <div
            className="option-card"
            onClick={() => navigateToPage('/add-funds')}
          >
            <i className="option-icon">💰</i>
            <p className="option-text">Add Funds</p>
          </div>
          <div
            className="option-card"
            onClick={() => navigateToPage('/check-balance')}
          >
            <i className="option-icon">💵</i>
            <p className="option-text">Check Balance</p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="password-modal">
          <h2>Change Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="primary-button" onClick={handlePasswordChange}>
            Save Password
          </button>
          <button
            className="secondary-button"
            onClick={() => setIsChangingPassword(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
