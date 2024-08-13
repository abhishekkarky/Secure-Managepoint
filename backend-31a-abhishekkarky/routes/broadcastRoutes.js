const authGuard = require('../middleware/authGuard')
const broadcastControllers = require('../controllers/broadcastControllers')

const router = require('express').Router()

router.post('/create', authGuard, broadcastControllers.createBroadcast)

router.get('/all', authGuard, broadcastControllers.getAllBroadcast)

router.get('/count',authGuard ,broadcastControllers.totalBroadcastCount)

router.get('/get/:id', authGuard, broadcastControllers.getSingleBroadcast)

router.delete('/delete/:id', authGuard, broadcastControllers.deleteBroadcastById)

router.put('/update/:id', authGuard, broadcastControllers.updateBroadcastById)

router.get('/countForGraph', authGuard, broadcastControllers.broadcastCountForGraph)

module.exports = router