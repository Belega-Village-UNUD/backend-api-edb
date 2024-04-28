const { response } = require("../../utils/response.utils");
const { Fee } = require("../../models");

const getOneFee = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findOne({ where: { id } });

    if (!fee) {
      return response(res, 404, false, `Fee Not Found`, null);
    }

    return response(res, 200, true, `Get ${fee.name} Successfull`, fee);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getOneFee;
