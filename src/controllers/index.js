const auth = require("./auth");
const profile = require("./profile");
const google = require("./google");
const product = require("./product");
const shop = require("./shop");
const transaction = require("./transaction");
const custom = require("./preorder");
const store = require("./store");
const fee = require("./fee");
const message = require("./message");

module.exports = {
  auth,
  profile,
  google,
  product,
  shop,
  transaction,
  custom,
  store,
  fee,
  message,
};
