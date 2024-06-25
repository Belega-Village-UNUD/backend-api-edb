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
    console.log("line 17:", user);

    const store = await Store.findOne({ where: { user_id: user.id } });
    if (!store) return response(res, 404, false, "Store not found", null);
    console.log("line 22:", store);

    const bankAccount = await StoreBankAccount.findOne({
      where: { id: store_bank_id, store_id: store.id, display: true },
    });
    if (!bankAccount) {
      return response(res, 404, false, "Bank Account not found", null);
    }
    console.log("line 29:", bankAccount);

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
    console.log("line 45:", recentBankAccount);

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
