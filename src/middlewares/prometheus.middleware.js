const { Prometheus } = require("../configs/prometheus.config");

/** This is the middleware for getting the
 * API hit count per path check the data into the
 * into the prometheus agent
 * check the data into the path of /metrics or /metrics/json */
const requestCount = async (req, res, next) => {
  try {
    Prometheus.apiCount.inc({
      method: req.method,
      route: req.path,
    });
    next();
  } catch (err) {
    return err;
  }
};

/** This is the middleware for getting the
 * response time check the data into the
 * into the prometheus agent
 * check the data into the path of /metrics or /metrics/json */
const responseTime = async (req, res, next) => {
  try {
    let duration = 0;
    const start = Date.now();
    res.on("finish", () => {
      duration = Date.now() - start;
      Prometheus.httpRequestDurationMicroseconds
        .labels(req.method, req.route.path, res.statusCode)
        .observe(duration);
    });

    next();
  } catch (err) {
    return err;
  }
};

module.exports = { requestCount, responseTime };
