const { getUser, getStore, getBankStore } = require("../../utils/orm.utils");
const { response } = require("../../utils/response.utils");
const { Payout, Store, StoreBankAccount } = require("../../models");

const getPayout = async (req, res) => {
  try {
    const { id } = req.user;
    const { store_bank_id, status } = req.query;

    const user = await getUser(id);
    if (!user) return response(res, 404, false, "User not found", null);

    const store = await getStore(user.id);
    if (!store) return response(res, 404, false, "Store not found", null);

    if (!store_bank_id) {
      if (!status) {
        const payouts = await Payout.findAll({
          attributes: { exclude: ["store_id", "store_bank_id"] },
          include: [
            {
              model: Store,
              as: "store",
              attributes: ["name"],
            },
            {
              model: StoreBankAccount,
              as: "store_bank",
              attributes: ["bank_name", "account_number", "account_name"],
            },
          ],
          where: { store_id: store.id },
        });
        if (payouts.length === 0) {
          return response(res, 404, false, "Payout is empty", null);
        }

        return response(
          res,
          200,
          true,
          `Payout Request ${store.name}`,
          payouts
        );
      }

      const payouts = await Payout.findAll({
        attributes: { exclude: ["store_id", "store_bank_id"] },
        include: [
          {
            model: Store,
            as: "store",
            attributes: ["name"],
          },
          {
            model: StoreBankAccount,
            as: "store_bank",
            attributes: ["bank_name", "account_number", "account_name"],
          },
        ],
        where: { store_id: store.id, status },
      });
      if (payouts.length === 0) {
        return response(res, 404, false, "Payout is empty", null);
      }

      return response(res, 200, true, `Payout Request ${store.name}`, payouts);
    }

    const storeBank = await getBankStore(user.id, store_bank_id);
    if (!storeBank)
      return response(res, 404, false, "Store bank not found", null);
    if (storeBank.length > 0)
      return response(res, 404, false, "Store bank is empty", null);

    const payout = await Payout.findOne({
      attributes: { exclude: ["store_id", "store_bank_id"] },
      include: [
        {
          model: Store,
          as: "store",
          attributes: ["name"],
        },
        {
          model: StoreBankAccount,
          as: "store_bank",
          attributes: ["bank_name", "account_number", "account_name"],
        },
      ],
      where: { store_id: store.id, store_bank_id: storeBank.id },
    });
    if (!payout) {
      return response(
        res,
        404,
        false,
        `Payout is empty ${storeBank.account_name} ${storeBank.bank_name} - ${storeBank.account_number}`,
        null
      );
    }

    return response(res, 200, true, `Payout Request ${store.name}`, payout);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getPayout;
