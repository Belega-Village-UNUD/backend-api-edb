const { response } = require("../../utils/response.utils");
const { Fee } = require("../../models");

const updateFee = async (req, res) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findOne({ where: { id: id } });
    if (!fee) {
      return response(res, 404, false, `Fee ${id} Not Found`, null);
    }

    const { name, interest, description } = req.body;

    await Fee.update(
      {
        name,
        interest,
        description,
      },
      { where: { id: id } }
    );

    const recentFee = await Fee.findOne({ where: { id: id } });

    return response(res, 200, true, `Fee ${id} has been updated`, recentFee);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = updateFee;
