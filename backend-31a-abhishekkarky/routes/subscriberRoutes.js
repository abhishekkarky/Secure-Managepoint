const express = require("express");
const authGuard = require("../middleware/authGuard");
const upload = require("../middleware/upload");
const subscriberController = require("../controllers/subscriberControllers");
const { body, param, query, validationResult } = require("express-validator");

const router = express.Router();

// Validation rules
const subscriberValidationRules = () => [
  body("fullName").notEmpty().withMessage("Full name is required").trim(),
  body("email").isEmail().withMessage("Valid email is required").trim(),
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
  "/add",
  authGuard,
  subscriberValidationRules(),
  validate,
  subscriberController.createSubscriber
);

router.get("/all", authGuard, subscriberController.getAllSubscribers);

router.get("/count", authGuard, subscriberController.totalsubscriberCount);

router.delete(
  "/delete/:id",
  authGuard,
  param("id").isMongoId().withMessage("Invalid subscriber ID"),
  validate,
  subscriberController.deleteSubscriberById
);

router.get(
  "/get/:id",
  authGuard,
  param("id").isMongoId().withMessage("Invalid subscriber ID"),
  validate,
  subscriberController.getSingleSubscriber
);

router.put(
  "/edit/:id",
  authGuard,
  param("id").isMongoId().withMessage("Invalid subscriber ID"),
  subscriberValidationRules(),
  validate,
  subscriberController.updateSubscriberById
);

router.post(
  "/add-subscribers-csv",
  authGuard,
  upload.single("csvFile"),
  subscriberController.handleCsvUpload
);

router.get(
  "/countForGraph",
  authGuard,
  subscriberController.subscriberCountForGraph
);

router.get(
  "/exportCSV",
  authGuard,
  subscriberController.exportSubscribersToCSV
);

module.exports = router;
