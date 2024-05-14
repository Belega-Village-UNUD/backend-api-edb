const { response } = require("../../utils/response.utils");
const { FeeHistory } = require("../../models");

const getOneHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const feeHistory = await FeeHistory.findOne({ where: { id } });

    if (!feeHistory) {
      return response(res, 404, false, `Fee History  Not Found`, null);
    }
    return response(res, 200, true, `Get Fee History Successfull`, feeHistory);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getOneHistory;
