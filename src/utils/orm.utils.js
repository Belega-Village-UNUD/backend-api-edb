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
  Role,
  StoreBankAccount,
  ProductRating,
} = require("../models");
const { ROLE } = require("./enum.utils");

const { mergeProduct, mergeTransactionData } = require("./merge.utils");

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

  getDetailTransaction: async (transaction_id, user_id) => {
    if (!user_id) {
      const detail = await DetailTransaction.findOne({
        where: {
          transaction_id: transaction_id,
        },
      });

      return detail;
    }

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

  checkAdmin: async (user_id) => {
    const user = await User.findOne({
      where: { id: user_id },
    });
    if (!user) return null;
    const role = await Role.findOne({
      where: { id: { [Op.in]: user.role_id } },
    });
    const isAdmin = role.name === ROLE.ADMIN ? true : false;
    return isAdmin;
  },

  checkIsAuthenticated: async (user_id) => {
    if (!user_id) return false;
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) return false;
    return true;
  },

  getBankStore: async (user_id, store_bank_id) => {
    const store = await Store.findOne({ where: { user_id: user_id } });
    let bank;

    if (!store_bank_id) {
      bank = await StoreBankAccount.findAll({
        where: { store_id: store.id, display: true },
      });
      if (bank.length === 0) {
        return null;
      }
      return bank;
    }

    bank = await StoreBankAccount.findOne({
      where: { id: store_bank_id, store_id: store.id, display: true },
    });

    return bank;
  },

  getBankAdmin: async (store_id, store_bank_id) => {
    let banks;
    if (!store_id && !store_bank_id) {
      banks = await StoreBankAccount.findAll({
        where: { display: true },
      });
      if (banks.length === 0) {
        return null;
      }
      return banks;
    }

    if (!store_bank_id) {
      banks = await StoreBankAccount.findAll({
        where: { store_id: store_id, display: true },
      });

      if (banks.length === 0) {
        return null;
      }
      return banks;
    }

    if (!store_id) {
      banks = await StoreBankAccount.findOne({
        where: { id: store_bank_id, display: true },
      });
      if (!banks) {
        return null;
      }
      return banks;
    }

    banks = await StoreBankAccount.findOne({
      where: { id: store_bank_id, store_id: store_id, display: true },
    });

    return banks;
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

    const tx_id = transactions.map((transaction) => transaction.id);
    const detailTransactions = await DetailTransaction.findAll({
      where: {
        transaction_id: {
          [Op.in]: tx_id,
        },
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
    });

    let total_income = 0;
    let products = [];
    for (const dtx of detailTransactions) {
      for (const productSold of dtx.carts_details) {
        products.push({
          product_id: productSold.product_id,
          total_product_sold: productSold.qty,
          unit_price: productSold.unit_price,
        });
      }
      total_income += dtx.sub_total_transaction_price_before_shipping;
    }

    const productSold = mergeProduct(products);

    //const data = detailTransactions;
    const data = {
      total_income,
      detailTransactions,
      productSold,
    };

    return data;
  },

  getOneTransaction: async (transaction_id) => {
    const data = await Transaction.findOne({
      where: {
        id: transaction_id,
      },
    });

    return data;
  },

  getOneTransactionWithProduct: async (transaction_id, cart_ids) => {
    const transaction = await Transaction.findOne({
      where: {
        id: transaction_id,
        [Op.and]: sequelize.literal(
          `cart_id && ARRAY[${cart_ids
            .map((id) => `'${id}'`)
            .join(",")}]::varchar[]`
        ),
      },
    });

    const carts = await module.exports.getCarts(cart_ids);
    const data = mergeTransactionData(carts);
    return data;
  },

  getUser: async (user_id) => {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ["id", "email"],
      include: [
        {
          model: Profile,
          as: "userProfile",
          attributes: ["id", "name", "city", "province"],
        },
      ],
    });

    return user;
  },

  getUser: async (user_id) => {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Profile,
          as: "userProfile",
          attributes: ["id", "name", "city", "province"],
        },
      ],
    });

    return user;
  },

  getCartsBasedOnProduct: async (product_id) => {
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
        "$product.id$": product_id,
      },
    });

    return carts;
  },

  getTransactionBasedOnProductSuccess: async (
    product_id,
    transaction_id,
    user_id
  ) => {
    const carts = await module.exports.getCartsBasedOnProduct(product_id);
    const cartIds = carts.map((cart) => cart.id);
    const transactionSuccess = await Transaction.findOne({
      where: {
        status: "SUCCESS",
        id: transaction_id,
        user_id: user_id,
        [Op.and]: sequelize.literal(
          `cart_id && ARRAY[${cartIds
            .map((id) => `'${id}'`)
            .join(",")}]::varchar[]`
        ),
      },
    });

    return transactionSuccess;
  },

  getRatingsByProduct: async (product_id, review) => {
    const whereClause = product_id ? { where: { product_id } } : {};
    const ratingBasedOnProduct = await ProductRating.findAll({
      attributes: ["id", "rate", "review", "display", "createdAt", "updatedAt"],
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name_product",
            "desc_product",
            "price",
            "stock",
            "image_product",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: Store,
              as: "store",
              attributes: [
                "id",
                "avatar_link",
                "name",
                "phone",
                "address",
                "province",
                "city",
                "createdAt",
                "updatedAt",
              ],
            },
          ],
        },
      ],
      ...whereClause,
    });

    return ratingBasedOnProduct;
  },
};
