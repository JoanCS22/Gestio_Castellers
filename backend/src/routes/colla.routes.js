const express = require('express');
const router = express.Router();

const { createColla, getCollesUser, getDataColla, modifyColla } = require('../controllers/colla.controller');
const auth = require('../middleware/auth');

router.post('/createColla', auth, createColla);
router.get('/getDataColla', auth, getDataColla);
router.post('/modifyColla', auth, modifyColla);
router.get('/getCollesUser', auth, getCollesUser);

module.exports = router;