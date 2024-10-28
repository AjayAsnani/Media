const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model


// Endpoint to get users whose status is not "pending"
router.get('/', async (req, res) => {
  try {
      // Fetch only users whose status is not "pending"
      const users = await User.find({ status: "Approved" } );      
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving users' });
  }
});


module.exports = router;