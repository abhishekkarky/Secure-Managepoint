const subscriberController = require('../controllers/subscriberControllers');
const authGuard = require('../middleware/authGuard');
const upload = require('../middleware/upload');

const router = require('express').Router();

router.post('/add', authGuard, subscriberController.createSubscriber)

router.get('/all',authGuard ,subscriberController.getAllSubscribers)

router.get('/count',authGuard ,subscriberController.totalsubscriberCount)

router.delete('/delete/:id', authGuard, subscriberController.deleteSubscriberById)

router.get('/get/:id',authGuard ,subscriberController. getSingleSubscriber)

router.put('/edit/:id', authGuard ,subscriberController.updateSubscriberById)

router.post('/add-subscribers-csv', authGuard, upload.single('csvFile'), subscriberController.handleCsvUpload);

router.get('/countForGraph', authGuard, subscriberController.subscriberCountForGraph);

router.get('/exportCSV', authGuard, subscriberController.exportSubscribersToCSV);

module.exports = router