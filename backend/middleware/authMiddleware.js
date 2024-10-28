// authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
        console.log("Token missing"); // Debugging line
        return res.status(401).json({ message: 'Unauthorized, token missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err.message); // Debugging line
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded; // Attach decoded payload (e.g., `id`) to `req.user`
        next();
    });
};

module.exports = verifyToken;
