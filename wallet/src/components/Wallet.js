import React from 'react';

const Wallet = ({ balance }) => {
  return (
    <div className="wallet">
      <h2>Current Balance</h2>
      <p>${balance}</p>
    </div>
  );
};

export default Wallet;
