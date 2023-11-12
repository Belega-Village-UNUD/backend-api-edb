require("dotenv").config();
const fs = require("fs");
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express");
const file = fs.readFileSync("./src/docs/v1.swagger.yml", "utf8");
const apiDocs = YAML.parse(file);
const router = require("express").Router();

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(apiDocs, {
    swaggerOptions: {
      requestInterceptor: function (request) {
        request.headers.Origin = `${process.env.HOST}:${process.env.PORT}`;
        return request;
      },
      url: `${process.env.HOST}:${process.env.PORT}/api/docs`,
    },
  })
);

module.exports = router;
