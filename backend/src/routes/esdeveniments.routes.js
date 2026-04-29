const express = require('express');
const router = express.Router();

const { createEsdeveniment, getEsdevenimentInfo, modifyEsdeveniment, getFutureEsdeveniments, getPastEsdeveniments } = require('../controllers/esdeveniments.controller');
const auth = require('../middleware/auth');

router.post('/createEsdeveniment', auth, createEsdeveniment);
router.get('/getEsdevenimentInfo', auth, getEsdevenimentInfo);
router.post('/modifyEsdeveniment', auth, modifyEsdeveniment);

router.get('/getFutureEsdeveniments', auth, getFutureEsdeveniments);
router.get('/getPastEsdeveniments', auth, getPastEsdeveniments);

module.exports = router;