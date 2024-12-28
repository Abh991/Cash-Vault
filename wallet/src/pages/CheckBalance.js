import React, { useState } from 'react';
import axios from 'axios';

const CheckBalance = () => {
  const [email, setEmail] = useState('');  // Changed to email
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  const handleCheckBalance = async () => {
    try {
      setError('');
      // Updated API request to search by email instead of userId
      const response = await axios.get(`/api/users/balance/${email}`);
      setBalance(response.data.balance);
    } catch (err) {
      setError('Error fetching balance. Please check the email ID.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Check Balance</h2>
      <div>
        <label htmlFor="email">Email ID:</label>
        <input
          type="email"  // Updated input type to email
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
      </div>
      <button onClick={handleCheckBalance} style={{ padding: '10px', width: '100%' }}>
        Check Balance
      </button>
      {balance !== null && <p>Your Balance: ${balance}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CheckBalance;
