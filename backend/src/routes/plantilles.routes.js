const express = require('express');
const router = express.Router();

const { getPlantillesByColla, getEstructuresByColla,
    createPlantilla, modifyInfoPlantilla,
    addPositionToPlantilla } = require('../controllers/plantilles.controller');
const auth = require('../middleware/auth');

router.get('/getPlantillesByColla', auth, getPlantillesByColla);
router.get('/getEstructuresByColla', auth, getEstructuresByColla);

router.post('/', auth, createPlantilla);
router.post('/modifyInfoPlantilla', auth, modifyInfoPlantilla);

router.post('/addPositionToPlantilla', auth, addPositionToPlantilla);

module.exports = router;