const db = require("../models");
const TIMEOUT = 10000;

module.exports = {
  connectDb: async () => {
    try {
      const timeout = setTimeout(() => {
        console.error("Unable to connect to the database: timeout");
        process.exit(1);
      }, TIMEOUT);

      await db.sequelize.authenticate();

      msg = "Database connection has been established successfully.";
      clearTimeout(timeout);
      return { status: true, message: msg };
    } catch (error) {
      msg = `Unable to connect to the database: ${error}`;
      return { status: false, message: msg };
    }
  },
  closeDb: async () => {
    try {
      await db.sequelize.close();
    } catch (error) {
      console.error(error);
    }
  },
};
