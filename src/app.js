require("dotenv").config();
const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const bodyParser = require("body-parser");
const db = require("./models");
const { Prometheus } = require("./configs/prometheus.config");
const { metric } = require("./utils/metric.utils");
const middlewares = require("./middlewares");
const { response } = require("./utils/response.utils");
const TIMEOUT = 5000;
const app = express();

Sentry.init({
  dsn: process.env.DSN_SENTRY,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewares.requestCount, middlewares.responseTime);
app.use("/api", router);

app.get("/", (req, res) => {
  Prometheus.apiCount.inc();
  response(res, 200, true, "Server API is Healthy", null);
});

app.get("/metrics/json", async (req, res) => {
  const metrics = await metric(res);
  response(res, 200, true, null, metrics);
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", Prometheus.client.register.contentType);
  res.end(await Prometheus.client.register.metrics());
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  // res.end(res.sentry + "\n");
  res.status(500).json({
    status: false,
    message: err,
  });
});

app.listen(process.env.PORT, async () => {
  try {
    try {
      const timeout = setTimeout(() => {
        console.error("Unable to connect to the database: timeout");
        process.exit(1);
      }, TIMEOUT);

      await db.sequelize.authenticate();

      clearTimeout(timeout);
      console.log("Database connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    console.log(`Server is running`);
  } catch (error) {
    console.error(error);
  }
});
