const express = require('express');
const router = express.Router();

const { createColla, getCollesUser, getDataColla, modifyColla, 
    getCollaPositions, updateCollaPositions, deleteCollaPositions, createCollaPosition, 
    getCollaRoles, createCollaRoles, updateCollaRoles, deleteCollaRole,
    getCollaGroups, updateCollaGroup, deleteCollaGroup, createCollaGroup,
} = require('../controllers/colla.controller');
const auth = require('../middleware/auth');

router.post('/createColla', auth, createColla);
router.get('/getDataColla', auth, getDataColla);
router.post('/modifyColla', auth, modifyColla);

router.get('/getCollesUser', auth, getCollesUser);

router.get('/getCollaPositions', auth, getCollaPositions);
router.post('/createCollaPosition', auth, createCollaPosition);
router.post('/updateCollaPositions', auth, updateCollaPositions);
router.delete('/deleteCollaPositions', auth, deleteCollaPositions);

router.get('/getCollaRoles', auth, getCollaRoles);
router.post('/createCollaRoles', auth, createCollaRoles);
router.post('/updateCollaRoles', auth, updateCollaRoles);
router.delete('/deleteCollaRole', auth, deleteCollaRole);

router.get('/getCollaGroups', auth, getCollaGroups);
router.post('/updateCollaGroup', auth, updateCollaGroup);
router.post('/createCollaGroup', auth, createCollaGroup);
router.delete('/deleteCollaGroup', auth, deleteCollaGroup);

module.exports = router;