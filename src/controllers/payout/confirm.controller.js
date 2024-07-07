const { getUser } = require("../../utils/orm.utils");
const { response } = require("../../utils/response.utils");

const confirmPayout = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await getUser(id);
    if (!user) return response(res, 404, false, "User not found", null);

    const { payout_id } = req.body;
    if (!req.body)
      return response(res, 400, false, "Request body is empty", null);

    // const payout
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = confirmPayout;
