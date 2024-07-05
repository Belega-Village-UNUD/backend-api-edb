const { response } = require("../../utils/response.utils");
const { User, Store, Payout } = require("../../models");
const { nanoid } = require("nanoid");

const requestPayout = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({
      where: { id },
      attributes: { excludes: ["password"] },
    });
    if (!user) return response(res, 404, false, "User not found", null);

    const store = await Store.findOne({ where: { user_id: user.id } });
    if (!store) return response(res, 404, false, "Store not found", null);

    const { store_bank_id, amount } = req.body;
    if (!req.body)
      return response(res, 400, false, "Request body is empty", null);

    const createRequest = await Payout.create({
      id: nanoid(10),
      store_id: store.id,
      store_bank_id,
      amount,
      status: "PENDING",
    });
    if (!createRequest)
      return response(res, 400, false, "Failed to request payout", null);

    return response(
      res,
      200,
      true,
      `Payout from store ${store.name} request success`,
      createRequest
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = requestPayout;
