const router = require("express").Router();
const controller = require("../../../controllers/profile");
const middleware = require("../../../middlewares");
const { MODULE } = require("../../../utils/enum.utils");
const { image } = require("../../../configs/multer.config");

router.post(
  "/",
  middleware.restrict,
  image.single("avatar"),
  controller.upAvatar
);
router.delete("/", middleware.restrict, controller.deleteAvatar);

module.exports = router;
