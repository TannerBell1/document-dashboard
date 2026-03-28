const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Login Function to verify user credentials and generate token
const login = async (req, res) => {
    try {
        const username= req.body.username;
        const password = req.body.password;

        // Check if username exists (Wait for database to respond)
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        // Return 401 error if username is not found
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Incorrect username or password' });
        }

        const user = result.rows[0];

        // Hash the provided password to compare with stored password hash (Wait for bcrypt to respond)
        const correctPassword = await bcrypt.compare(password, user.password);

        // Return 401 error if password is incorrect
        if (!correctPassword) {
            return res.status(401).json({ error: 'Incorrect username or password' });
        }

        // Generate containing user Id, secret server key, and expiration time
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token });

    } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { login };