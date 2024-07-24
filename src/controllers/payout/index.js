const requestPayout = require("./request.controller");
const getPayout = require("./get-payout.controller");
const confirmPayout = require("./confirm.controller");
const proofPayout = require("./payment-proof.controller");
const getPayoutAdmin = require("./get-payout-admin.controller");

module.exports = {
  requestPayout,
  getPayout,
  confirmPayout,
  proofPayout,
  getPayoutAdmin,
};
