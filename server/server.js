// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Set Mongoose strictQuery to true
mongoose.set('strictQuery', true);

// Initialize the Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.log('MongoDB connection error: ', error));

// Create a simple user model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  upiId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 500 }, // Default balance set to 500
});

const User = mongoose.model('User', userSchema);

// Function to generate a unique UPI ID using crypto
const generateUpiId = async (email) => {
  // Start with a basic UPI ID based on the user's email
  let upiId = `${email.split('@')[0]}@cashvault`;

  // Generate a secure random string using crypto
  const randomString = crypto.randomBytes(4).toString('hex'); // Generate a 8-character random hex string

  // Combine email prefix with the random string to ensure uniqueness
  upiId = `${email.split('@')[0]}${randomString}@cashvault`;

  // Check if the UPI ID already exists in the database
  const existingUser = await User.findOne({ upiId });
  if (existingUser) {
    // If the UPI ID exists, regenerate a unique ID
    return generateUpiId(email); // Recursive call to try generating a new UPI ID
  }

  return upiId;
};

// API endpoint to register a new user
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate a unique UPI ID
    const upiId = await generateUpiId(email);

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with a default balance of 500
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      upiId,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// API endpoint to login user and generate JWT token
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        upiId: user.upiId,
        balance: user.balance, // Send balance information to the frontend
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// API endpoint to get user balance by email
app.get('/api/users/:email/balance', async (req, res) => {
  const { email } = req.params;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send the balance as a response
    res.json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching balance.' });
  }
});

// API endpoint to handle money transfer between users
app.post('/transfer', async (req, res) => {
  const { senderUpiId, receiverUpiId, amount } = req.body;

  try {
    // Validate input fields
    if (!senderUpiId || !receiverUpiId || !amount) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if amount is a valid positive number
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ error: 'Invalid transfer amount' });
    }

    // Find sender and receiver by UPI ID
    const sender = await User.findOne({ upiId: senderUpiId });
    const receiver = await User.findOne({ upiId: receiverUpiId });

    if (!sender || !receiver) {
      return res.status(400).json({ error: 'Sender or receiver not found' });
    }

    // Check if the sender has sufficient balance
    if (sender.balance < transferAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct the amount from sender and add to receiver
    sender.balance -= transferAmount;
    receiver.balance += transferAmount;

    // Save the updated users
    await sender.save();
    await receiver.save();

    res.status(200).json({
      message: `₹${transferAmount} successfully transferred to ${receiver.name}`,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance,
    });
  } catch (error) {
    console.error('Error during money transfer:', error);
    res.status(500).json({ error: 'Server error during money transfer' });
  }
});

// Set the port from the environment variable or default to 5001
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
