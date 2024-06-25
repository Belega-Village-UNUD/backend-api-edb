const { readFileSyncJSON } = require("../../utils/file.utils");
const { response } = require("../../utils/response.utils");

const getListBank = async (req, res) => {
  try {
    let data = readFileSyncJSON("bank.json");
    if (!data) {
      return response(res, 404, false, "Bank not found", null);
    }

    return response(res, 200, true, "Successfully get list of bank", data);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getListBank;
