const router = require("express").Router();
const controllers = require("../../../controllers/product");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");
const { image } = require("../../../configs/multer.config");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.getAllProductSeller
);
router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.getOneProductSeller
);
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.create
);
router.put(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.update
);
router.delete(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.deleteProduct
);
router.post(
  "/images",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  image.array("product_images"),
  controllers.imagesProduct
);

module.exports = router;
