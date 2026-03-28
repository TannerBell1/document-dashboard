const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments, getDocument } = require('../controllers/documentController');

// Middleware for authentication and file upload
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Maps URL to document functions in documentController
router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/', auth, getDocuments);
router.get('/:id', auth, getDocument);

module.exports = router;