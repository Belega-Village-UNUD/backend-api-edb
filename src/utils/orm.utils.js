const { Op } = require("sequelize");
const {
  Cart,
  User,
  Product,
  Profile,
  Store,
  ProductType,
  Transaction,
  DetailTransaction,
} = require("../models");

module.exports = {
  getCarts: async (cartIds) => {
    const carts = await Cart.findAll({
      attributes: ["id", "user_id", "product_id", "qty", "unit_price"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            {
              model: Profile,
              as: "userProfile",
              attributes: ["id", "name", "city", "province"],
            },
          ],
        },
        {
          model: Product,
          as: "product",
          include: [
            {
              model: ProductType,
              as: "product_type",
              attributes: ["name", "material"],
            },
            {
              model: Store,
              as: "store",
              attributes: [
                "id",
                "name",
                "phone",
                "address",
                "description",
                "province",
                "city",
              ],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "email"],
                  include: [
                    {
                      model: Profile,
                      as: "userProfile",
                      attributes: ["id", "name", "city", "province"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: {
        id: { [Op.in]: cartIds },
      },
    });

    return carts;
  },
  getDetailTransaction: async (transaction_id, user_id) => {
    const detail = await DetailTransaction.findOne({
      where: {
        transaction_id: transaction_id,
        ...(user_id && { "$transaction.user_id$": user_id }),
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
    });

    return detail;
  },
  getStore: async (user_id) => {
    const store = await Store.findOne({
      where: { user_id: user_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            {
              model: Profile,
              as: "userProfile",
              attributes: ["id", "name", "city", "province"],
            },
          ],
        },
      ],
    });

    return store;
  },
};
