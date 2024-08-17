const express = require("express");
const authGuard = require("../middleware/authGuard");
const groupControllers = require("../controllers/groupControllers");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();

// Validation rules for creating and updating groups
const groupValidationRules = () => [
  body("name").notEmpty().withMessage("Group name is required"),
  body("groupType").notEmpty().withMessage("Group type is required"),
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
  groupValidationRules(),
  validate,
  groupControllers.createGroup
);

router.get("/all", authGuard, groupControllers.getAllGroups);

router.get(
  "/get/:id",
  authGuard,
  param("id").isMongoId().withMessage("Invalid group ID"),
  validate,
  groupControllers.singleGroupById
);

router.put(
  "/update/:id",
  authGuard,
  param("id").isMongoId().withMessage("Invalid group ID"),
  groupValidationRules(),
  validate,
  groupControllers.updateGroupById
);

router.delete(
  "/delete/:id",
  authGuard,
  param("id").isMongoId().withMessage("Invalid group ID"),
  validate,
  groupControllers.deleteGroupById
);

module.exports = router;
