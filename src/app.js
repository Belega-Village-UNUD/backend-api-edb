require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const bodyParser = require("body-parser");
const db = require("./models");
const { Prometheus } = require("./configs/prometheus.config");
const { metric } = require("./utils/metric.utils");
const middlewares = require("./middlewares");
const { response } = require("./utils/response.utils");
const TIMEOUT = 10000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewares.requestCount, middlewares.responseTime);
app.use("/api", router);

app.get("/", (req, res) => {
  Prometheus.apiCount.inc();
  response(
    res,
    200,
    true,
    "Server API for Demonstration is Healthy, it is 200",
    null
  );
});

app.get("/metrics/json", async (req, res) => {
  const metrics = await metric(res);
  response(res, 200, true, null, metrics);
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", Prometheus.client.register.contentType);
  res.end(await Prometheus.client.register.metrics());
});

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
