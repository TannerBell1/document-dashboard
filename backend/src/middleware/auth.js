const jwt = require('jsonwebtoken');

// Middleware to authenticate requests from users using JWT Token
const auth = (req, res, next) => {
    // extract token from Authorization header, if it exists
    const token = req.headers.authorization?.split(' ')[1];

    // Return 401 error if token is missing
    if (!token) {
        return res.status(401).json({ error: 'Missing Token' });
    }

    // Check if token is valid, if it is invalid return 401 error
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};

module.exports = auth;