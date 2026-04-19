const express = require('express');
const router = express.Router();

const { getUserData } = require('../controllers/profile.controller');
const auth = require('../middleware/auth');


router.get('/getUserData', getUserData);
//TODO: router.post('/modifyUserData', modifyUserData);
//TODO: router.post('/modifyPassword', modifyPassword);

module.exports = router;