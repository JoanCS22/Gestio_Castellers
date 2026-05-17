const express = require('express');
const router = express.Router();

const {
    getProvesByEsdeveniment, getProvaById,
    createProva, deleteProva,
    modifyInfoProva, updateOrder, publishProva, updateFavorite, updateFeta,
    getAssignacionsProva, desasignarPosicioProva, buidarPlantillaProva, eliminarAbsentsProva,
    asignarPosicioProva, intercanviarPosicions, canviarAssignacio, canviPosicionsBuidaPlena,
} = require('../controllers/proves.controller');
const auth = require('../middleware/auth');

router.get('/getProvesByEsdeveniment', auth, getProvesByEsdeveniment);
router.get('/getProvaById', auth, getProvaById);

router.post('/createProva', auth, createProva);
router.delete('/deleteProva', auth, deleteProva);

router.post('/modifyInfoProva', auth, modifyInfoProva);
router.post('/updateOrder', auth, updateOrder);
router.post('/publishProva', auth, publishProva);
router.post('/updateFavorite', auth, updateFavorite);
router.post('/updateFeta', auth, updateFeta);

router.get('/getAssignacionsProva', auth, getAssignacionsProva);
router.post('/desasignarPosicioProva', auth, desasignarPosicioProva);
router.delete('/buidarPlantillaProva', auth, buidarPlantillaProva);
router.delete('/eliminarAbsentsProva', auth, eliminarAbsentsProva);

router.post('/asignarPosicioProva', auth, asignarPosicioProva);
router.post('/intercanviarPosicions', auth, intercanviarPosicions);
router.post('/canviarAssignacio', auth, canviarAssignacio);
router.post('/canviPosicionsBuidaPlena', auth, canviPosicionsBuidaPlena);

module.exports = router;