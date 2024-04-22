const { response } = require("../../utils/response.utils");
const { Fee } = require("../../models");

const getOneFee = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findOne({ where: { id } });

    if (fee.length === 0) {
      return response(res, 404, false, `Fee ${id} Not Found`, null);
    }
    return response(res, 200, true, `Get Fee ${id} Successfull`, fee);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getOneFee;
