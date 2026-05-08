const express = require('express');
const router = express.Router();

const { getPlantillesByColla, getEstructuresByColla,
    createPlantilla, modifyInfoPlantilla,
    getPositionsByPlantilla, addPositionToPlantilla, deletePositionsFromPlantilla, modifyPositionsFromPlantilla
} = require('../controllers/plantilles.controller');
const auth = require('../middleware/auth');

router.get('/getPlantillesByColla', auth, getPlantillesByColla);
router.get('/getEstructuresByColla', auth, getEstructuresByColla);

router.post('/createPlantilla', auth, createPlantilla);
router.post('/modifyInfoPlantilla', auth, modifyInfoPlantilla);

router.get('/getPositionsByPlantilla', auth, getPositionsByPlantilla);
router.post('/addPositionToPlantilla', auth, addPositionToPlantilla);
router.post('/modifyPositionsFromPlantilla', auth, modifyPositionsFromPlantilla);
router.delete('/deletePositionsFromPlantilla', auth, deletePositionsFromPlantilla);

module.exports = router;