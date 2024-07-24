const vault = require("../configs/vault.config");
const { RAJAONGKIRAPI_KEY } = require("../utils/constan");

module.exports = {
  checkStatus: async () => {
    const status = await vault.healthCheck();
    return status;
  },
  getSecrets: async () => {
    const secret = await vault.readKVSecret(
      process.env.VAULT_TOKEN,
      process.env.VAULT_SECRET_PATH
    );
    const data = secret.data;
    return data;
  },
};
