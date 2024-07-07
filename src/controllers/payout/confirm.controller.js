const { getUser } = require("../../utils/orm.utils");
const { response } = require("../../utils/response.utils");
const { Payout } = require("../../models");

const confirmPayout = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await getUser(id);
    if (!user) return response(res, 404, false, "User not found", null);

    const { payout_id } = req.body;
    if (!req.body)
      return response(res, 400, false, "Request body is empty", null);

    const payout = await Payout.findOne({ where: { id: payout_id } });
    if (!payout)
      return response(res, 404, false, "Payout request not found", null);

    if (payout.status !== "PENDING") {
      return response(
        res,
        400,
        false,
        "Payout request has already been processed",
        null
      );
    }

    const updatedPayout = await Payout.update(
      { status: "ONGOING" },
      { where: { id: payout_id } }
    );
    if (!updatedPayout) {
      return response(
        res,
        500,
        false,
        "Failed to confirm payout request",
        null
      );
    }

    return response(res, 200, true, "Payout request confirmed", null);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = confirmPayout;
