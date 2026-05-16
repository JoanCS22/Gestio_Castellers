const express = require('express');
const router = express.Router();

const { getProvesByEsdeveniment, getProvaById,
    createProva, deleteProva,
    modifyInfoProva, updateOrder, publishProva, updateFavorite, updateFeta,
    getAssignacionsProva, asignarPosicioProva, desasignarPosicioProva, intercanviarPosicions, buidarPlantillaProva, eliminarAbsentsProva
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
router.post('/asignarPosicioProva', auth, asignarPosicioProva);
router.post('/desasignarPosicioProva', auth, desasignarPosicioProva);
router.post('/intercanviarPosicions', auth, intercanviarPosicions);
router.delete('/buidarPlantillaProva', auth, buidarPlantillaProva);
router.delete('/eliminarAbsentsProva', auth, eliminarAbsentsProva);

module.exports = router;