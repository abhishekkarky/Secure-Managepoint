const express = require('express');
const authGuard = require('../middleware/authGuard');
const broadcastControllers = require('../controllers/broadcastControllers');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules for creating and updating broadcast
const broadcastValidationRules = () => [
  body('broadcastTitle').notEmpty().withMessage('Broadcast title is required'),
  body('broadcastTo').notEmpty().withMessage('Broadcast target is required'),
  body('broadcastDescription').notEmpty().withMessage('Broadcast description is required'),
  // Add more validations as needed
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes with validation and error handling
router.post(
  '/create',
  authGuard,
  broadcastValidationRules(),
  validate,
  broadcastControllers.createBroadcast
);

router.get('/all', authGuard, broadcastControllers.getAllBroadcast);

router.get('/count', authGuard, broadcastControllers.totalBroadcastCount);

router.get(
  '/get/:id',
  authGuard,
  param('id').isMongoId().withMessage('Invalid broadcast ID'),
  validate,
  broadcastControllers.getSingleBroadcast
);

router.delete(
  '/delete/:id',
  authGuard,
  param('id').isMongoId().withMessage('Invalid broadcast ID'),
  validate,
  broadcastControllers.deleteBroadcastById
);

router.put(
  '/update/:id',
  authGuard,
  param('id').isMongoId().withMessage('Invalid broadcast ID'),
  broadcastValidationRules(),
  validate,
  broadcastControllers.updateBroadcastById
);

router.get('/countForGraph', authGuard, broadcastControllers.broadcastCountForGraph);

module.exports = router;
