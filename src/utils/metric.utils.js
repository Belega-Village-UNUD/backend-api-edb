const { Prometheus } = require("../configs/prometheus.config");

const metric = async (res, status, success, message, data) => {
  try {
    const metrics = await Prometheus.client.register.metrics();
    const metricsArray = metrics.split("\n");
    const metricsJson = metricsArray.reduce((acc, curr) => {
      const [key, value] = curr.split(" ");
      if (key && value) acc[key] = value;
      return acc;
    }, {});
    return metricsJson;
  } catch (error) {
    return error;
  }
};

module.exports = { metric };
