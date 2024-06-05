const router = require("express").Router();
const controllers = require("../../controllers/preorder");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post(
  "/custom",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.BUYER, true, false),
  middleware.buyerVerified,
  controllers.upCustomDesign
);

module.exports = router;
