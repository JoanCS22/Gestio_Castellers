const express = require('express');
const router = express.Router();

const { getPlantillesByColla, getEstructuresByColla, getPlantillaById,
    createPlantilla, modifyInfoPlantilla, deletePlantilla,
    getPositionsByPlantilla, addPositionToPlantilla, deletePositionsFromPlantilla, modifyPositionsFromPlantilla
} = require('../controllers/plantilles.controller');
const auth = require('../middleware/auth');

router.get('/getPlantillesByColla', auth, getPlantillesByColla);
router.get('/getEstructuresByColla', auth, getEstructuresByColla);
router.get('/getPlantillaById', auth, getPlantillaById);

router.post('/createPlantilla', auth, createPlantilla);
router.post('/modifyInfoPlantilla', auth, modifyInfoPlantilla);
router.delete('/deletePlantilla', auth, deletePlantilla);

router.get('/getPositionsByPlantilla', auth, getPositionsByPlantilla);
router.post('/addPositionToPlantilla', auth, addPositionToPlantilla);
router.post('/modifyPositionsFromPlantilla', auth, modifyPositionsFromPlantilla);
router.delete('/deletePositionsFromPlantilla', auth, deletePositionsFromPlantilla);

module.exports = router;