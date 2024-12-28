const express = require('express');
const User = require('../models/userModel');  // Your User model
const router = express.Router();

// Route to get balance by email
router.get('/balance/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If no user found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return the balance of the user
    res.json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching balance.' });
  }
});

module.exports = router;
