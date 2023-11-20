const router = require("express").Router();
const {
  imageStorage,
  documentStorage,
  image,
  document,
} = require("../../configs/multer.config");
const controllers = require("../../controllers");

router.post(
  "/storage/images",
  imageStorage.single("image"),
  controllers.media.singleUpload
);
router.post(
  "/storage/documents",
  documentStorage.single("document"),
  controllers.media.singleUpload
);
router.post(
  "/storage/images/multi",
  imageStorage.array("image"),
  controllers.media.multiUpload
);
router.post(
  "/imagekit/images",
  image.single("image"),
  controllers.media.uploadToImageKit
);
router.post(
  "/storage/documents",
  document.single("document"),
  controllers.media.uploadToImageKit
);
module.exports = router;
