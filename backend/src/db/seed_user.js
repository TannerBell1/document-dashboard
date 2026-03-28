const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    const username = 'johnny';
    const password = 'test';
    
    // Hash the password for extra security
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Use a parameterized query to prevent SQL injection
    await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        [username, hashedPassword]
    );
    
    console.log('User created successfully');
    console.log('Username: johnny');
    console.log('Password: test');
    process.exit(0);
};

seed();