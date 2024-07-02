const { response } = require("../../utils/response.utils");
const { User, StoreBankAccount, Store } = require("../../models");

const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { store_bank_id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) return response(res, 404, false, "User not found", null);

    const store = await Store.findOne({ where: { user_id: user.id } });
    if (!store) return response(res, 404, false, "Store not found", null);

    const bankAccount = await StoreBankAccount.findOne({
      where: { id: store_bank_id, display: true },
    });
    if (!bankAccount) {
      return response(
        res,
        404,
        false,
        `Bank Account ${store.name} not found`,
        null
      );
    }

    await StoreBankAccount.update(
      { display: false },
      { where: { id: store_bank_id } }
    );
    const updatedBankAccount = await StoreBankAccount.findOne({
      where: { id: store_bank_id },
    });

    return response(
      res,
      200,
      true,
      `Successfull Delete Bank Account ${store.name}`,
      updatedBankAccount
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = deleteBankAccount;
