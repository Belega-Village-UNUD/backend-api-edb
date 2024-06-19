const router = require("express").Router();
const { image } = require("../../configs/multer.config");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post("/register", controllers.auth.register);
router.post("/login", controllers.auth.login);
router.post(
  "/login/admin",
  middleware.loginAdmin,
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.ADMIN, true, false),
  controllers.auth.login
);
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
router.post(
  "/register/store",
  middleware.restrict,
  image.single("ktp"),
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, true),
  controllers.auth.registerStore
);
router.put(
  "/verify-store",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.ADMIN, true, true),
  controllers.auth.verifyStore
);
router.put(
  "/declined-store",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.ADMIN, true, true),
  controllers.auth.declinedStore
);

module.exports = router;
