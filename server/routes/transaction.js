const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Transaction route for transferring money
router.post('/transaction/transfer', async (req, res) => {
  const { senderUpiId, receiverUpiId, amount } = req.body;

  try {
    if (!senderUpiId || !receiverUpiId || !amount) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const amountToSend = parseFloat(amount);

    if (isNaN(amountToSend) || amountToSend <= 0) {
      return res.status(400).json({ error: 'Please enter a valid amount' });
    }

    const sender = await User.findOne({ upiId: senderUpiId });
    const receiver = await User.findOne({ upiId: receiverUpiId });

    if (!sender || !receiver) {
      return res.status(400).json({ error: 'Sender or receiver not found' });
    }

    if (sender.balance < amountToSend) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    sender.balance -= amountToSend;
    receiver.balance += amountToSend;

    await sender.save();
    await receiver.save();

    res.status(200).json({
      message: `₹${amountToSend} successfully transferred to ${receiver.name}`,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance,
    });
  } catch (error) {
    console.error('Error during money transfer:', error);
    res.status(500).json({ error: 'Server error during money transfer' });
  }
});

module.exports = router;
