const { Op } = require("sequelize");
const sequelize = require("sequelize");
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
  getCartsBasedOnStore: async (store_id) => {
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
        "$product.store.id$": store_id,
      },
    });

    return carts;
  },
  getDetailTransaction: async (transaction_id) => {
    const detail = await DetailTransaction.findOne({
      where: { transaction_id: transaction_id },
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
  getSalesReport: async (store_id) => {
    const carts = await module.exports.getCartsBasedOnStore(store_id);
    const cartIds = carts.map((cart) => cart.id);
    console.log(cartIds.length);
    const transactions = await Transaction.findAll({
      where: {
        status: "SUCCESS",
        [Op.and]: sequelize.literal(
          `cart_id && ARRAY[${cartIds
            .map((id) => `'${id}'`)
            .join(",")}]::varchar[]`
        ),
      },
    });

    const detailTransactions = await DetailTransaction.findAll({
      where: {
        transaction_id: {
          [Op.in]: transactions.map((transaction) => transaction.id),
        },
      },
    });

    return transactions;
  },
};
