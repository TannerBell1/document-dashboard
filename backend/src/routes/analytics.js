const express = require('express');
const router = express.Router();
const { uploadedStatistics, processedStatistics, statusAnalytics } = require('../controllers/analyticsController');

// Middleware for authentication and file upload
const auth = require('../middleware/auth');


// Maps URL to analytics functions in analyticsController
router.get('/uploaded', auth, uploadedStatistics);
router.get('/processed', auth, processedStatistics);
router.get('/status', auth, statusAnalytics);

module.exports = router;