const pool = require('../config/db');
const processDocument = require('../jobs/processDocument');

// Handles file uploads and initiates asynchronous processing
const uploadDocument = async (req, res) => {
    try {
        const { originalname, filename, path: filePath } = req.file;

        // Add document metadata to database with initial status 'uploaded'
        const result = await pool.query(
            `INSERT INTO documents (user_id, filename, original_name, file_path, status)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user.id, filename, originalname, filePath, 'uploaded']
        );

        const document = result.rows[0];

        // Process asynchronously (no await)
        processDocument(document.id, filePath);

        res.status(201).json({
            message: 'Document uploaded successfully',
            document
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Fetch all documents for the dashboard ordered by create date
const getDocuments = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM documents ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Gather all date for a specific document including processing results and status
const getDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM documents WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { uploadDocument, getDocuments, getDocument };