const multer = require('multer');
const path = require('path');

// Saves files to uploads with timestamp in filename to avoid duplicates.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}_${file.originalname}`);
    }
});

// File filter to allow max 10 mbs documents and only pdf, docx, and txt files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();

    // Check if the filetype is allowed, return error if not
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOCX, and TXT allowed.'));
    }
};

// Set up multer with defined storage settings, filter for file type, and size limit
const upload = multer({
    storage,
    fileFilter,
    // Set file size limit to 10 mbs
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;