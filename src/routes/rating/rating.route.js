const router = require("express").Router();
const { MODULE, ROLE } = require("../../utils/enum.utils");
const middleware = require("../../middlewares");
const controllers = require("../../controllers");

router.get("/", controllers.rating.getRating);
router.get("/store", controllers.rating.getRatingStore);
router.get(
  "/admin",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, false),
  controllers.rating.getRating
);

router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.LANDING, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controllers.rating.createRating
);

module.exports = router;
