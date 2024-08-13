const groupControllers = require('../controllers/groupControllers');
const authGuard = require('../middleware/authGuard');

// importing Router
const router = require('express').Router();

router.post('/add', authGuard, groupControllers.createGroup)

router.get('/all', authGuard, groupControllers.getAllGroups)

router.get('/get/:id', authGuard, groupControllers.singleGroupById)

router.put('/update/:id', authGuard, groupControllers.updateGroupById)

router.delete('/delete/:id', authGuard, groupControllers.deleteGroupById)

module.exports = router