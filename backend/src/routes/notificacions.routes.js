const express = require('express');
const router = express.Router();

const { 
    getUserNotifications, createNotification,
} = require('../controllers/notificacions.controller');
const auth = require('../middleware/auth');

router.get('/getUserNotifications', auth, getUserNotifications);
router.post('/createNotification', auth, createNotification);

module.exports = router;