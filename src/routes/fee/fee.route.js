const router = require("express").Router();
const { image } = require("../../configs/multer.config");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.getAll
);
router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.getOne
);
router.get(
  "/seller/:id",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, true),
  controllers.fee.getOne
);
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.create
);
router.put(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.update
);
router.delete(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.deleteFee
);

module.exports = router;
