import React, { useState } from 'react';
import './SendMoneyPage.css';

const SendMoneyPage = () => {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMoney = async () => {
    setMessage('');
    setLoading(true);

    if (!upiId || !amount) {
      setMessage('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setMessage('Enter a valid amount.');
      setLoading(false);
      return;
    }

    // Prepare the request body
    const requestBody = {
      senderUpiId: 'sender_upi_id_here', // Replace with the sender's actual UPI ID
      receiverUpiId: upiId,
      amount: amount,
    };

    try {
      const response = await fetch('http://localhost:5001/api/transaction/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while processing the transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-money-page">
      <h2>Send Money</h2>
      <div className="form-group">
        <label htmlFor="upiId">Receiver's UPI ID</label>
        <input
          type="text"
          id="upiId"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="Enter recipient's UPI ID"
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount (₹)</label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="input-field"
        />
      </div>
      <button
        onClick={handleSendMoney}
        disabled={loading}
        className="send-button"
      >
        {loading ? 'Sending...' : 'Send Money'}
      </button>
      {message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
    </div>
  );
};

export default SendMoneyPage;
