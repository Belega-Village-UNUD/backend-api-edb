const { response } = require("../../utils/response.utils");
const { Fee } = require("../../models");

const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findOne({ where: { id } });
    if (!fee) {
      return response(res, 404, false, `Fee ${id} Not Found`, null);
    }
    await Fee.destroy({ where: { id } });
    return response(res, 200, true, `Delete Fee ${id} Successfull`, null);
  } catch {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = deleteFee;
