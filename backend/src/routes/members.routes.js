const express = require('express');
const router = express.Router();

const { getMembers, addMember, modifyMember, deleteMember, searchUsers } = require('../controllers/members.contoller');
const auth = require('../middleware/auth');

router.get('/getMembers', auth, getMembers);
router.post('/searchUsers', auth, searchUsers);
router.post('/addMember', auth, addMember);
router.post('/modifyMember', auth, modifyMember);
router.delete('/deleteMember', auth, deleteMember);

module.exports = router;