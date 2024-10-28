const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
    const { email } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the new user based on email
        const newUser = await User.findOne({ email }).session(session);
        if (!newUser) {
            return res.status(404).send('User not found.');
        }

        // Find the direct referrer
        let directReferrer = null;
        if (newUser.referPhoneNumber) {
            // Use the referPhoneNumber to find the direct referrer
            directReferrer = await User.findOne({ phone: newUser.referPhoneNumber }).session(session);
        }

        // Fallback to a default referrer if no direct referrer is found
        if (!directReferrer) {
            directReferrer = await User.findOne({ phone: "9999999999" }).session(session);
        }

        // Create a new referral chain based on direct referrer’s chain
        let newReferralChain = [];
        if (directReferrer) {
            if (!directReferrer.referredBy || directReferrer.referredBy.length === 0) {
                newReferralChain = [directReferrer._id];
            } else if (directReferrer.referredBy.length < 21) {
                newReferralChain = [...directReferrer.referredBy, directReferrer._id];
            } else {
                newReferralChain = [...directReferrer.referredBy.slice(1), directReferrer._id];
            }
        }

        // Update the new user with the referral chain and approve them
        newUser.referredBy = newReferralChain;
        newUser.status = 'Approved';
        await newUser.save({ session });

        // Direct sponsor receives 500
        if (directReferrer) {
            await User.findByIdAndUpdate(
                directReferrer._id,
                { $inc: { currentBalance: 500, totalIncome: 500, totalRefers:1} },
                { session }
            );
        }

        // Indirect referrals receive 20 each
        for (let i = 0; i < newReferralChain.length; i++) {
            const indirectReferrerId = newReferralChain[i];
            // Skip updating the direct referrer since they already received 500
            if (indirectReferrerId.toString() !== directReferrer._id.toString()) {
                await User.findByIdAndUpdate(
                    indirectReferrerId,
                    { $inc: { currentBalance: 20, totalIncome: 20,totalRefers: 1 } },
                    { session }
                );
            }
        }

        await session.commitTransaction();
        res.status(200).send(`Approval successful for ${email}`);
    } catch (error) {
        await session.abortTransaction();
        console.error('Error during user approval:', error);
        res.status(500).send('Error approving user. Changes rolled back.');
    } finally {
        session.endSession();
    }
});

module.exports = router;