const router = require("express").Router();
const typeRouter = require("./type/type.route");
const guestRouter = require("./guest/guest.route");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");
const { image } = require("../../configs/multer.config");

router.get(
  "/all",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, true),
  controllers.product.getAllProduct
);
router.get(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, true),
  controllers.product.getOneProduct
);
router.post(
  "/",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, true),
  image.single("productImage"),
  controllers.product.createProduct
);
// router.post(
//   "/image",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   image.single("productImage"),
//   controllers.product.uploadImage
// );
router.put(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, true),
  controllers.product.updateProduct
);
router.delete(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, true),
  controllers.product.deleteProduct
);

router.use("/types", typeRouter);
router.use("/guest", guestRouter);

module.exports = router;
