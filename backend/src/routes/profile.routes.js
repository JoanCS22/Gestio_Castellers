const express = require('express');
const router = express.Router();

const { getUserData, modifyUserData, changePassword } = require('../controllers/profile.controller');
const auth = require('../middleware/auth');


router.get('/getUserData', auth, getUserData);
router.post('/modifyUserData', auth, modifyUserData);
router.post('/changePassword', changePassword);

module.exports = router;