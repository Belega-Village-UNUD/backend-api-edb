const { response } = require("../../utils/response.utils");
const { Fee } = require("../../models");

const updateFee = async (req, res) => {
  try {
    const { fee_id, name, interest, description } = req.body;

    const fee = await Fee.findOne({ where: { id: fee_id, display: true } });
    if (!fee) {
      return response(res, 404, false, `Fee Not Found`, null);
    }

    await Fee.update(
      {
        name,
        interest,
        description,
      },
      { where: { id: fee_id } }
    );

    const recentFee = await Fee.findOne({
      where: { id: fee_id, display: true },
    });

    return response(
      res,
      200,
      true,
      `Fee ${fee.name} has been updated`,
      recentFee
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = updateFee;
