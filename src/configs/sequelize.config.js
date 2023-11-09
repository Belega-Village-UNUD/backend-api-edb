require("dotenv").config();

const {
  DEV_DB_USERNAME,
  DEV_DB_PASSWORD,
  DEV_DB_NAME,
  DEV_DB_HOST,
  DEV_DB_PORT,
  STAGING_DB_USERNAME,
  STAGING_DB_PASSWORD,
  STAGING_DB_NAME,
  STAGING_DB_HOST,
  STAGING_DB_PORT,
  PROD_DB_USERNAME,
  PROD_DB_PASSWORD,
  PROD_DB_NAME,
  PROD_DB_HOST,
  PROD_DB_PORT,
} = process.env;

module.exports = {
  development: {
    username: DEV_DB_USERNAME,
    password: DEV_DB_PASSWORD,
    database: DEV_DB_NAME,
    host: DEV_DB_HOST,
    dialect: "postgres",
    port: DEV_DB_PORT,
  },
  staging: {
    username: STAGING_DB_USERNAME,
    password: STAGING_DB_PASSWORD,
    database: STAGING_DB_NAME,
    host: STAGING_DB_HOST,
    dialect: "postgres",
    port: STAGING_DB_PORT,
  },
  production: {
    username: PROD_DB_USERNAME,
    password: PROD_DB_PASSWORD,
    database: PROD_DB_NAME,
    host: PROD_DB_HOST,
    dialect: "postgres",
    port: PROD_DB_PORT,
  },
};
