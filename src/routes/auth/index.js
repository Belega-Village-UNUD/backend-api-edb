const router = require("express").Router();
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");

router.post("/register", controllers.auth.register);
router.post("/login", controllers.auth.login);
router.post(
  "/otp/verify",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, true, false),
  controllers.auth.verifyUser
);
router.post("/otp", controllers.auth.resendOTP);
router.post("/password/forgot", controllers.auth.forgotPassword);
router.put(
  "/password/reset",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, true, false),
  controllers.auth.resetPassword
);
router.put(
  "/password/change",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, true, false),
  controllers.auth.changePassword
);

module.exports = router;
