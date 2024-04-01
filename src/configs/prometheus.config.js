const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics({
  app: "backend-ecommerce-desa-belega",
  prefix: "backend_api_",
  timeout: 400,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

const apiCount = new client.Counter({
  name: "nodejs_api_count",
  help: "Count requests to the API",
  labelNames: ["method", "route", "code"],
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.001, 0.01, 0.1, 1, 2, 5], // buckets for response time from 0.1ms to 500ms
});

const Prometheus = {
  client,
  apiCount,
  collectDefaultMetrics,
  httpRequestDurationMicroseconds,
};

module.exports = { Prometheus };
