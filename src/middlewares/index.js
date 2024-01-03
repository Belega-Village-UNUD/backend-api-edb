const restrict = require("./restrict.middleware");
const rbac = require("./rbac.middleware");
const { requestCount, responseTime } = require("./prometheus.middleware");

module.exports = { restrict, rbac, requestCount, responseTime };
