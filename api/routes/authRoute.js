const express = require("express");
const authController = require("../controller/authController.js");
const { body } = require("express-validator");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

router.post(
  "/signup",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  authController.signUp
);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/change-password", authenticate, authController.changePassword);
router.post("/forgot-password", authController.forgetPassword);
router.post("/reset-password", authenticate,authController.resetPassword);

module.exports = router;
