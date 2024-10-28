// changePasswordRoute.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware'); // JWT-based auth middleware
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {

    try {
        const { currentPassword, newPassword } = req.body;
     
        
        // Get user ID from decoded JWT in `verifyToken`
        const userId = req.user.id;

        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

        // Hash and save the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
