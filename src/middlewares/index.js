const restrict = require("./restrict.middleware");
const rbac = require("./rbac.middleware");
const loginAdmin = require("./admin/login.middleware");
const storeVerified = require("./seller/verified.middleware");
const buyerVerified = require("./buyer/verified.middleware");
const { requestCount, responseTime } = require("./prometheus.middleware");

module.exports = {
  restrict,
  rbac,
  loginAdmin,
  requestCount,
  responseTime,
  storeVerified,
  buyerVerified,
};
