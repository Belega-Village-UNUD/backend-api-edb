const { response } = require("../../utils/response.utils");
const { User, Store, StoreBankAccount } = require("../../models");
const { nanoid } = require("nanoid");

const createBankAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { bank_name, bank_code, account_number, account_name } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) return response(res, 404, false, "User not found", null);

    const store = await Store.findOne({ where: { user_id: user.id } });
    if (!store) return response(res, 404, false, "Store not found", null);

    const bankAccount = await StoreBankAccount.create({
      id: nanoid(10),
      store_id: store.id,
      bank_name,
      bank_code,
      account_number,
      account_name,
    });

    return response(
      res,
      200,
      true,
      `Successfull Create Bank Account ${store.name}`,
      bankAccount
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = createBankAccount;
