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
const { parseDate } = require("./date.utils");
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

  getAllCarts: async () => {
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

  getStoreInfo: async (store_id) => {
    const rating = await ProductRating.findAll({
      where: { store_id, display: true },
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

    const averageRating = (rating) => {
      let total = 0;

      rating.forEach((rate) => {
        total += rate.rate;
      });

      const avg = total / rating.length;

      return parseFloat(avg.toFixed(1));
    };

    const store = await Store.findOne({
      where: { id: store_id },
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
              attributes: ["id", "name", "avatar_link", "city", "province"],
            },
          ],
        },
      ],
    });

    const product = await Product.findAll({
      where: { store_id },
      attributes: { exclude: ["image_product"] },
      include: [
        {
          model: ProductType,
          as: "product_type",
          attributes: ["id", "name", "material"],
        },
      ],
    });

    return {
      data: {
        store,
        product,
        rating,
        average_rating: averageRating(rating),
      },
    };
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
      order: [["updatedAt", "DESC"]],
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

    const data = {
      total_income,
      detail_transactions: detailTransactions,
      product_sold: productSold,
    };

    return data;
  },

  getSalesReportBasedCustomDate: async (store_id, start_date, end_date) => {
    if (!start_date) {
      return { data: null, message: "Please provide Start Date" };
    }

    if (!end_date) {
      return { data: null, message: "Please provide End Date" };
    }

    const formattedStartDate = parseDate(start_date);
    let formattedEndDate = parseDate(end_date);
    formattedEndDate.setHours(23, 59, 59, 999);

    if (formattedStartDate > formattedEndDate) {
      return { data: null, message: "Start Date must be before End Date" };
    }

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
        updatedAt: {
          [Op.between]: [formattedStartDate, formattedEndDate],
        },
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
      order: [["updatedAt", "DESC"]],
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

    const data = {
      total_income,
      detail_transactions: detailTransactions,
      product_sold: productSold,
    };

    return {
      data: data,
      message: `Sales Report between ${start_date} and ${end_date} Retreived Successfully`,
    };
  },

  getAllSalesReport: async () => {
    const carts = await module.exports.getAllCarts();
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
      order: [["updatedAt", "DESC"]],
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

    const data = {
      total_income,
      detail_transactions: detailTransactions,
      product_sold: productSold,
    };

    return { data: data, message: "All Sales Report Retreived Successfully" };
  },

  getAllSalesReportBasedCustomDate: async (start_date, end_date) => {
    if (!start_date) {
      return { data: null, message: "Please provide Start Date" };
    }

    if (!end_date) {
      return { data: null, message: "Please provide End Date" };
    }

    const formattedStartDate = parseDate(start_date);
    let formattedEndDate = parseDate(end_date);
    formattedEndDate.setHours(23, 59, 59, 999);

    if (formattedStartDate > formattedEndDate) {
      return { data: null, message: "Start Date must be before End Date" };
    }

    const carts = await module.exports.getAllCarts();
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
        updatedAt: {
          [Op.between]: [formattedStartDate, formattedEndDate],
        },
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
      order: [["updatedAt", "DESC"]],
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

    const data = {
      total_income,
      detail_transactions: detailTransactions,
      product_sold: productSold,
    };

    return {
      data: data,
      message: `All Sales Report between ${start_date} and ${end_date} Retreived Successfully`,
    };
  },

  getOneTransaction: async (transaction_id) => {
    const data = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: { id: transaction_id },
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

  getTransactionBuyerAll: async (user_id) => {
    const transactions = await Transaction.findAll({
      where: {
        user_id: user_id,
      },
      order: [["updatedAt", "DESC"]],
    });

    if (!transactions || transactions.length === 0) {
      return { data: null, message: "No transactions found for this user" };
    }

    const cartIds = [].concat(
      ...transactions.map((transaction) => transaction.cart_id)
    );

    // Fetch the carts
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
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Product,
          as: "product",
          include: [
            {
              model: Store,
              as: "store",
              attributes: ["id", "name"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "email"],
                  include: [
                    {
                      model: Profile,
                      as: "userProfile",
                      attributes: ["id", "name"],
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

    // Merge the cart details into the transactions
    const mergedTransactions = transactions.map((transaction) => {
      const cart_details = transaction.cart_id.map((id) => {
        const cart = carts.find((cart) => cart.id === id);
        return cart || id;
      });

      return { ...transaction.toJSON(), cart_details };
    });

    return {
      data: mergedTransactions,
      message: "Transaction Retreived Successfully",
    };
  },

  getTransactionBuyerAllCustomDate: async (user_id, start_date, end_date) => {
    if (!start_date) {
      return { data: null, message: "Please provide Start Date" };
    }

    if (!end_date) {
      return { data: null, message: "Please provide End Date" };
    }

    const formattedStartDate = parseDate(start_date);
    let formattedEndDate = parseDate(end_date);
    formattedEndDate.setHours(23, 59, 59, 999);

    if (formattedStartDate > formattedEndDate) {
      return { data: null, message: "Start Date must be before End Date" };
    }

    const transactions = await Transaction.findAll({
      where: {
        user_id: user_id,
        updatedAt: {
          [Op.between]: [formattedStartDate, formattedEndDate],
        },
      },
      order: [["updatedAt", "DESC"]],
    });

    if (!transactions || transactions.length === 0) {
      return { data: null, message: "No transactions found for this user" };
    }

    const cartIds = [].concat(
      ...transactions.map((transaction) => transaction.cart_id)
    );

    // Fetch the carts
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
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Product,
          as: "product",
          include: [
            {
              model: Store,
              as: "store",
              attributes: ["id", "name"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "email"],
                  include: [
                    {
                      model: Profile,
                      as: "userProfile",
                      attributes: ["id", "name"],
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

    // Merge the cart details into the transactions
    const mergedTransactions = transactions.map((transaction) => {
      const cart_details = transaction.cart_id.map((id) => {
        const cart = carts.find((cart) => cart.id === id);
        return cart || id;
      });

      return { ...transaction.toJSON(), cart_details };
    });

    return {
      data: mergedTransactions,
      message: "Transaction Retreived Successfully",
    };
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
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            { model: Profile, as: "userProfile", attributes: ["id", "name"] },
          ],
        },
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name_product",
            "desc_product",
            "price",
            "stock",
            "images",
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
  getCartFinalPrice: async (cartIds, storeUserId) => {
    const carts = await Cart.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            {
              model: Profile,
              as: "userProfile",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Product,
          as: "product",
          include: [
            {
              model: Store,
              as: "store",
              attributes: ["id", "name"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "email"],
                  include: [
                    {
                      model: Profile,
                      as: "userProfile",
                      attributes: ["id", "name"],
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
        "$product.store_id$": storeUserId.id,
      },
    });

    return carts;
  },
};
