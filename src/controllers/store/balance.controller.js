const { response } = require("../../utils/response.utils");
const { Store, User, StoreBalance, StoreBankAccount } = require("../../models");

const getStoreBalance = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return response(res, 404, false, "User not found", null);
    }
    const store = await Store.findOne({
      where: { user_id: user.id },
      attributes: {
        exclude: [
          "user_id",
          "ktp_link",
          "is_verified",
          "unverified_reason",
          "createdAt",
          "updatedAt",
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "id",
              "is_verified",
              "password",
              "role_id",
              "store_id",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });
    if (!store) {
      return response(res, 404, false, "Store not found", null);
    }

    const bank = await StoreBankAccount.findAll({
      where: { store_id: store.id, display: true },
    });

    if (!bank) {
      return response(
        res,
        404,
        false,
        "Bank Account should be available",
        null
      );
    }

    const storeBalance = await StoreBalance.findOne({
      where: { store_id: store.id },
    });

    return response(
      res,
      200,
      true,
      `Successfully get store balance for ${store.name}`,
      storeBalance
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getStoreBalance;
