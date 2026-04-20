const express = require('express');
const router = express.Router();

const { getUserData, modifyUserData } = require('../controllers/profile.controller');
const auth = require('../middleware/auth');


router.get('/getUserData', auth, getUserData);
router.post('/modifyUserData', auth, modifyUserData);
//TODO: router.post('/modifyPassword', modifyPassword);

module.exports = router;