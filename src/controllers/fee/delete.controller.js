const { response } = require("../../utils/response.utils");
const { Fee } = require("../../models");

const deleteFee = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return response(res, 400, false, "Fee ID is required", null);

    const fee = await Fee.findOne({ where: { id, display: true } });
    if (!fee) {
      return response(res, 404, false, `Fee Not Found`, null);
    }

    await Fee.update({ display: false }, { where: { id } });

    return response(res, 200, true, `Delete Fee ${fee.name} Successfull`, null);
  } catch {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = deleteFee;
