const router = require("express").Router();
const controllers = require("../../../controllers/product");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.BUYER, true, false),
  controllers.getAllProductBuyer
);

router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.BUYER, true, false),
  controllers.getOneProductBuyer
);

module.exports = router;
