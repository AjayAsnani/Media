const express = require('express');
const router = express.Router();
const { handleWithdrawal } = require('../controllers/withdrawlController');

router.post('/', handleWithdrawal);

module.exports = router;