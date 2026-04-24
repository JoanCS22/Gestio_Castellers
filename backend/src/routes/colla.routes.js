const express = require('express');
const router = express.Router();

const { createColla, getCollesUser, getDataColla, modifyColla, getCollaPositions, updateCollaPositions, 
    deleteCollaPositions, createCollaPosition } = require('../controllers/colla.controller');
const auth = require('../middleware/auth');

router.post('/createColla', auth, createColla);
router.get('/getDataColla', auth, getDataColla);
router.post('/modifyColla', auth, modifyColla);

router.get('/getCollesUser', auth, getCollesUser);

router.get('/getCollaPositions', auth, getCollaPositions);
router.post('/createCollaPosition', auth, createCollaPosition);
router.post('/updateCollaPositions', auth, updateCollaPositions);
router.post('/deleteCollaPositions', auth, deleteCollaPositions);

module.exports = router;