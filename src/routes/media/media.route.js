const router = require("express").Router();
const { image, document } = require("../../configs/multer.config");
const controllers = require("../../controllers");

//router.post(
//  "/storage/images",
//  image.single("image"),
//  controllers.media.singleUpload
//);
//router.post(
//  "/storage/avatar",
//  image.single("image"),
//  controllers.media.singleUpload
//);
//router.post(
//  "/storage/documents",
//  document.single("document"),
//  controllers.media.singleUpload
//);
//router.post(
//  "/storage/images/multi",
//  image.array("images"),
//  controllers.media.multiUpload
//);
//router.post(
//  "/storage/documents/multi",
//  image.array("documents"),
//  controllers.media.multiUpload
//);
module.exports = router;
