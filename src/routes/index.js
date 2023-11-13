const router = require("express").Router();
const { response } = require("../utils/response.utils");
const auth = require("./auth");
const profile = require("./profile");
const docs = require("./docs");
const google = require("./google");

router.get("/", (req, res) => {
  return response(res, 200, true, "Server API is healthy");
});

router.use("/auth", auth);
router.use("/profiles", profile);
router.use("/docs", docs);
router.use("/google", google);

module.exports = router;
