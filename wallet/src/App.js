import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SendMoneyPage from './pages/SendMoneyPage'; // Import SendMoneyPage
import CheckBalance from './pages/CheckBalance';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to SplashScreen */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/send-money" element={<SendMoneyPage />} /> {/* New Send Money Route */}
        <Route path="/check-balance" element={<CheckBalance />} />
      </Routes>
    </Router>
  );
};

export default App;
