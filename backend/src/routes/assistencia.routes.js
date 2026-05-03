const express = require('express');
const router = express.Router();

const { getAssistenciaList, getAssistenciaByMember,
    modifyAssistenciaPrevia, modifyAssistenciaPreviaTecnica,
    confirmAssistencia } = require('../controllers/assistencia.controller');
const auth = require('../middleware/auth');

router.get('/getAssistenciaList', auth, getAssistenciaList);
router.get('/getAssistenciaByMember', auth, getAssistenciaByMember);

router.post('/modifyAssistenciaPrevia', auth, modifyAssistenciaPrevia);
router.post('/modifyAssistenciaPreviaTecnica', auth, modifyAssistenciaPreviaTecnica);

router.post('/confirmAssistencia', auth, confirmAssistencia);

module.exports = router;