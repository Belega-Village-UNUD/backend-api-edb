const { response } = require("../../utils/response.utils");
const { FeeHistory } = require("../../models");

const getAllHistory = async (req, res) => {
  try {
    const feeHistory = await FeeHistory.findAll();
    if (feeHistory.length === 0) {
      return response(res, 404, false, "Fee History Not Found", null);
    }

    return response(
      res,
      200,
      true,
      "Get All Fee History Successful",
      feeHistory
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getAllHistory;
