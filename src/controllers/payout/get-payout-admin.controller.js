const { response } = require("../../utils/response.utils");
const { Payout, Store, StoreBankAccount } = require("../../models");

const getPayoutAdmin = async (req, res) => {
  try {
    const whereClause = [];
    for (const key in req.query) {
      whereClause.push({ [key]: req.query[key] });
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
      where: whereClause,
    });
    if (payouts.length === 0) {
      return response(res, 404, false, "Payout is empty", null);
    }

    return response(res, 200, true, "List Payout Request Success", payouts);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getPayoutAdmin;
