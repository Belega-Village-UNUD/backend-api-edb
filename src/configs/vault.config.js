require("dotenv").config();
const Vault = require("hashi-vault-js");

const vault = new Vault({
  https: true,
  baseUrl: process.env.VAULT_BASE_URL,
  rootPath: process.env.VAULT_ROOT_PATH,
  timeout: 2000,
});

module.exports = vault;
