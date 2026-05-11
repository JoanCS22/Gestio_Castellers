const express = require('express');
const router = express.Router();

const { getProvesByEsdeveniment, getProvaById,
    createProva, modifyInfoProva, deleteProva,
} = require('../controllers/proves.controller');
const auth = require('../middleware/auth');

router.get('/getProvesByEsdeveniment', auth, getProvesByEsdeveniment);
router.get('/getProvaById', auth, getProvaById);

router.post('/createProva', auth, createProva);
router.post('/modifyInfoProva', auth, modifyInfoProva);
router.delete('/deleteProva', auth, deleteProva);

module.exports = router;