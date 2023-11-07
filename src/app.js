require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const bodyParser = require("body-parser");
const db = require("./models");
const { response } = require("./utils/response.utils");
const TIMEOUT = 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", router);

app.get("/", (req, res) => {
  return response(res, 200, true, "Server is healthy");
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
