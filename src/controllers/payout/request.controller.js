const { response } = require("../../utils/response.utils");
const {
  User,
  Payout,
  StoreBankAccount,
  StoreBalance,
} = require("../../models");
const { nanoid } = require("nanoid");
const { getStore } = require("../../utils/orm.utils");

const requestPayout = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({
      where: { id },
      attributes: { excludes: ["password"] },
    });
    if (!user) return response(res, 404, false, "User not found", null);

    const store = await getStore(user.id);
    if (!store) return response(res, 404, false, "Store not found", null);

    const { store_bank_id, amount } = req.body;
    if (!req.body)
      return response(res, 400, false, "Request body is empty", null);

    const checkMinAmount = amount < 10000;
    if (checkMinAmount)
      return response(res, 400, false, "Minimum amount is Rp 10.000", null);

    const storeBank = await StoreBankAccount.findOne({
      where: { id: store_bank_id, store_id: store.id },
    });
    if (!storeBank)
      return response(res, 404, false, "Store bank not found", null);

    const storeBalance = await StoreBalance.findOne({
      where: { store_id: store.id },
    });

    if (!storeBalance)
      return response(res, 404, false, "Store balance doesn't match", null);
    if (storeBalance.balance < amount)
      return response(res, 400, false, "Insufficient balance", null);

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
      `Request payout ${store.name} success`,
      createRequest
    );
  } catch (err) {
    console.error(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = requestPayout;
