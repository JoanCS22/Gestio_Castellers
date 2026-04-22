const express = require('express');
const router = express.Router();

const { createColla, getCollesUser } = require('../controllers/colla.controller');
const auth = require('../middleware/auth');

router.post('/createColla', auth, createColla);
// routes.get('/getDataColla', auth, getDataColla);
//TODO: routes.post('/modifyColla', auth, modifyColla);
router.get('/getCollesUser', auth, getCollesUser);

module.exports = router;