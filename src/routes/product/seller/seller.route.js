const router = require("express").Router();
const controllers = require("../../../controllers/product");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");
const { image } = require("../../../configs/multer.config");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.getAllProductSeller
);
router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.getOneProductSeller
);
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.create
);
router.put(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.update
);
router.delete(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.deleteProduct
);
router.post(
  "/image",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  image.single("productImage"),
  controllers.imageProduct
);

module.exports = router;
