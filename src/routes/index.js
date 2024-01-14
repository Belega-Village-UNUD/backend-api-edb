const router = require("express").Router();
const { response } = require("../utils/response.utils");
const auth = require("./auth/auth.route");
const profile = require("./profile/profile.route");
const docs = require("./docs/docs.route");
const google = require("./google/google.route");
const media = require("./media/media.route");
const products = require("./product/product.route");
const cart = require("./shop/cart.route");
const transaction = require("./transaction/transaction.route");

router.get("/", (req, res) => {
  return response(res, 200, true, "Server API is healthy");
});

router.use("/auth", auth);
router.use("/profiles", profile);
router.use("/docs", docs);
router.use("/google", google);
router.use("/media", media);
router.use("/products", products);
router.use("/cart", cart);
router.use("/transaction", transaction);

module.exports = router;
