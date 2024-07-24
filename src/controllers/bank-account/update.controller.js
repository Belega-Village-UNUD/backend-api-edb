const { response } = require("../../utils/response.utils");
const { User, Store, StoreBankAccount } = require("../../models");

const updateBankAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      store_bank_id,
      bank_name,
      bank_code,
      account_number,
      account_name,
    } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) return response(res, 404, false, "User not found", null);

    const store = await Store.findOne({ where: { user_id: user.id } });
    if (!store) return response(res, 404, false, "Store not found", null);

    const bankAccount = await StoreBankAccount.findOne({
      where: { id: store_bank_id, store_id: store.id, display: true },
    });
    if (!bankAccount) {
      return response(res, 404, false, "Bank Account not found", null);
    }

    await StoreBankAccount.update(
      {
        bank_name,
        bank_code,
        account_number,
        account_name,
      },
      {
        where: { id: store_bank_id, store_id: store.id },
      }
    );

    const recentBankAccount = await StoreBankAccount.findOne({
      where: { id: store_bank_id, store_id: store.id, display: true },
    });

    return response(
      res,
      200,
      true,
      `Successfull Update Bank Account ${store.name}`,
      recentBankAccount
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = updateBankAccount;
