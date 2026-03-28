const pool = require('../config/db');

// Gather the number of documents uploaded per day in ascending order
const uploadedStatistics = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT DATE(created_at) as day, COUNT(*) as count FROM documents GROUP BY DATE(created_at) ORDER BY day ASC;',
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Gather the number of documents processed per day in ascending order 
const processedStatistics = async (req, res) => {
    try {
        const result = await pool.query(
             'SELECT DATE(processed_at) as day, COUNT(*) as count FROM documents WHERE processed_at IS NOT NULL GROUP BY DATE(processed_at) ORDER BY day ASC;'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Gather the count of documents in each processing status (uploaded, processing, completed, failed)
const statusAnalytics = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT status, COUNT(*)::int as count FROM documents GROUP BY status;'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { uploadedStatistics, processedStatistics, statusAnalytics };