const express = require('express');
const router = express.Router();

const { getMembers, addMember, modifyMember, deleteMember, searchUsers, getDataMember, getMemberPermissions } = require('../controllers/members.contoller');
const auth = require('../middleware/auth');

router.get('/getMembers', auth, getMembers);
router.post('/searchUsers', auth, searchUsers);
router.post('/addMember', auth, addMember);
router.delete('/deleteMember', auth, deleteMember);

router.post('/modifyMember', auth, modifyMember);
router.get('/getDataMember', auth, getDataMember);

router.get('/getMemberPermissions', auth, getMemberPermissions);

module.exports = router;