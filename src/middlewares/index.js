const restrict = require("./restrict.middleware");
const rbac = require("./rbac.middleware");
const storeVerified = require("./seller/verified.middleware");
const buyerVerified = require("./buyer/verified.middleware");
const { requestCount, responseTime } = require("./prometheus.middleware");

module.exports = {
  restrict,
  rbac,
  requestCount,
  responseTime,
  storeVerified,
  buyerVerified,
};
