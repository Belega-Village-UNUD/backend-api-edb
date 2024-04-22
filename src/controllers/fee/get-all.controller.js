const { response } = require("../../utils/response.utils");
const { Fee } = require("../../models");

const getAllFee = async (req, res) => {
  try {
    const fee = await Fee.findAll();
    if (fee.length === 0) {
      return response(res, 404, false, `Fee Not Found`, null);
    }
    return response(res, 200, true, `Get All Fee Successfull`, fee);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getAllFee;
