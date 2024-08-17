const express = require('express');
const {
  createUser,
  loginUser,
  updateUser,
  updateUserPassword,
  forgotPassword,
  resetPassword,
  unsubscribe,
  uploadImage,
  getUserById,
  getGrowthRate,
} = require('../controllers/userControllers');
const authGuard = require('../middleware/authGuard');
const upload = require('../middleware/upload');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const userValidationRules = () => [
  body('fullName').notEmpty().withMessage('Full name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').trim(),
  body('password').notEmpty().withMessage('Password is required'),
  // Add more validations as needed
];

const updateUserValidationRules = () => [
  body('fullName').optional().trim(),
  body('email').optional().isEmail().withMessage('Valid email is required').trim(),
  body('address').optional().trim(),
  body('number').optional().trim(),
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
router.post('/create', userValidationRules(), validate, createUser);

router.post('/login', userValidationRules(), validate, loginUser);

router.put(
  '/editProfile/:id',
  authGuard,
  updateUserValidationRules(),
  validate,
  updateUser
);

router.put('/editPassword/:id', authGuard, updateUserPassword);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.put(
  '/unsubscribe/:userId/:subscriberId',
  authGuard,
  unsubscribe
);

router.put(
  '/uploadImage/:id',
  authGuard,
  upload.single('userImage'),
  uploadImage
);

router.get('/getUser/:id', authGuard, getUserById);

router.get('/getGrowthRate', authGuard, getGrowthRate);

module.exports = router;
