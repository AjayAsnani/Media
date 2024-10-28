const jwt = require('jsonwebtoken'); // For token verification
const WithdrawalRecord = require('../models/WithdrawlRecord'); // Model for storing withdrawal records
const User = require('../models/User');

const handleWithdrawal = async (req, res) => {
    // Get the token from the authorization header
    const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token
    const { amount } = req.body;

    try {
        // Decode the token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
        console.log(decoded);
        const userId = decoded.id; // Extract user ID from decoded token

        const user = await User.findById(userId);

        const lastWithdrawal = await WithdrawalRecord.findOne({ userId }).sort({ createdAt: -1 });

        if (lastWithdrawal && (Date.now() - lastWithdrawal.createdAt) < 30 * 24 * 60 * 60 * 1000) {
            return res.json({ success: false, message: 'Withdrawal can only be made once every 30 days.' });
        }
        // New check: Ensure current balance is greater than or equal to the withdrawal amount
        if (user.currentBalance < amount) {
            return res.json({ success: false, message: 'Current balance must be greater than or equal to the withdrawal amount.' });
        }

        // Business Logic
        if (amount < 500) {
            return res.json({ success: false, message: 'Minimum required amount is 500 INR.' });
        }



        // Proceed with withdrawal
        user.currentBalance -= amount;
        await user.save();

        // Record the withdrawal
        const withdrawalRecord = new WithdrawalRecord({ userId, amount });
        await withdrawalRecord.save();

        res.json({ success: true, message: 'Withdrawal successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { handleWithdrawal };