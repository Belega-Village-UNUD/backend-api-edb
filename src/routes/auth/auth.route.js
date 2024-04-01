const router = require("express").Router();
const { image } = require("../../configs/multer.config");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post("/register", controllers.auth.register);
router.post(
  "/register/seller",
  middleware.restrict,
  image.single("ktp"),
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.auth.registerSeller
);
router.post("/login", controllers.auth.login);
router.post(
  "/otp/verify",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.auth.verifyUser
);
router.get(
  "/otp",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.auth.getOTP
);
router.post("/otp", controllers.auth.resendOTP);
router.post("/password/forgot", controllers.auth.forgotPassword);
router.put(
  "/password/reset",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.auth.resetPassword
);
router.put(
  "/password/change",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.auth.changePassword
);

module.exports = router;
