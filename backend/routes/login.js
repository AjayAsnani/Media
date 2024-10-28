// login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const router = express.Router();

// Secret key for JWT (consider storing in environment variable for security)
const JWT_SECRET = process.env.JWT_SECRET ;

// Login Route
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if the user exists (case insensitive email query)
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).select('+password');
    
    
    // console.log(user);
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1d' }  // Token expires in 1 day
    );

    // Respond with the JWT token
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;