const express = require("express");
const { check, validationResult } = require("express-validator"); // Add express-validator for validation
const authGuard = require("../middleware/authGuard");
const broadcastControllers = require("../controllers/broadcastControllers");

const router = express.Router();

// Validation rules
const broadcastValidationRules = () => [
  check("title").isString().notEmpty().withMessage("Title is required"),
  check("content").isString().notEmpty().withMessage("Content is required"),
];

// Middleware to validate requests
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes with validation and authentication
router.post(
  "/create",
  authGuard,
  broadcastValidationRules(),
  validateRequest,
  broadcastControllers.createBroadcast
);

router.get("/all", authGuard, broadcastControllers.getAllBroadcast);

router.get("/count", authGuard, broadcastControllers.totalBroadcastCount);

router.get("/get/:id", authGuard, broadcastControllers.getSingleBroadcast);

router.delete(
  "/delete/:id",
  authGuard,
  broadcastControllers.deleteBroadcastById
);

router.put(
  "/update/:id",
  authGuard,
  broadcastValidationRules(),
  validateRequest,
  broadcastControllers.updateBroadcastById
);

router.get(
  "/countForGraph",
  authGuard,
  broadcastControllers.broadcastCountForGraph
);

module.exports = router;
