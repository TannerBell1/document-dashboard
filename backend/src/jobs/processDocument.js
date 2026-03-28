const pool = require('../config/db');
const fs = require('fs');

// Asynchronously process document
const processDocument = async (documentId, filePath) => {
    try {
        // Simulate delay before processing
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Set status to processing
        await pool.query(
            'UPDATE documents SET status = $1 WHERE id = $2',
            ['processing', documentId]
        );

        // Read the file
        const content = await fs.promises.readFile(filePath, 'utf8');

        // Calcualte word count, generate preview and write summary
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        const preview = content.substring(0, 100);
        const summary = `This document contains ${wordCount} words.`;

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 8000));

        // Update status to completed with results
        await pool.query(
            `UPDATE documents 
             SET status = $1, word_count = $2, preview = $3, summary = $4, processed_at = CURRENT_TIMESTAMP 
             WHERE id = $5`,
            ['completed', wordCount, preview, summary, documentId]
        );
    
    // sets status to 'failed' if any error occurs during processing
    } catch (error) {
        await pool.query(
            'UPDATE documents SET status = $1 WHERE id = $2',
            ['failed', documentId]
        );
        console.error('Processing error:', error);
    }
};

module.exports = processDocument;