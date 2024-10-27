// login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

// Login Route
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Case-insensitive email search
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).select('+password');

    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } // 1 day expiry
    );

    // Send JWT token
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
