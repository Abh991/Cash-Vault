// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },  // New field for phone number
  identity: { 
    type: String, 
    enum: ['AadharCard', 'PanCard', 'Passport'],  // Valid identity options
    required: true 
  },
  identityNumber: { type: String, required: true },  // New field for identity number
  upiId: { type: String, required: true, unique: true },  // UPI ID field
  balance: { type: Number, default: 500 }, // User balance
},
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
