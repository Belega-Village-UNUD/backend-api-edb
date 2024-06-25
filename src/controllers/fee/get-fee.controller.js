const { response } = require("../../utils/response.utils");
const { Fee } = require("../../models");

const getFee = async (req, res) => {
  try {
    const { fee_id } = req.query;

    if (!fee_id) {
      const fee = await Fee.findAll({ where: { display: true } });
      if (!fee) {
        return response(res, 404, false, `Fee Not Found`, null);
      }

      if (fee.length === 0) {
        return response(res, 404, false, `Fee is empty`, null);
      }

      return response(res, 200, true, `Get All Fee Successfull`, fee);
    }

    const fee = await Fee.findOne({ where: { id: fee_id, display: true } });
    if (!fee) {
      return response(res, 404, false, `Fee Not Found`, null);
    }

    return response(res, 201, true, `Get ${fee.name} Successfull`, fee);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getFee;
