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
} = require("../controllers/userControllers");
const authGuard = require("../middleware/authGuard");

const upload = require("../middleware/upload");

const router = require("express").Router();

router.post("/create", createUser);

router.post("/login", loginUser);

router.put("/editProfile/:id", updateUser);

router.put("/editPassword/:id", updateUserPassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.put("/unsubscribe/:userId/:subscriberId", unsubscribe);

router.put("/uploadImage/:id", upload.single("userImage"), uploadImage);

router.get("/getUser/:id", getUserById);

router.get('/getGrowthRate', authGuard, getGrowthRate),

module.exports = router;
