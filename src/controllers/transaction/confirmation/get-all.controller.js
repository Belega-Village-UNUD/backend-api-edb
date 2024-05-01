const Sequelize = require("sequelize");
const { Transaction, Cart, Product, Store } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const getAllTransactions = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const store = await Store.findOne({ where: { user_id } });
    console.log("🚀 ~ getAllTransactions ~ store:", store);

    if (!store) return response(res, 404, false, "Store not found", null);

    const products = await Product.findAll({
      where: { store_id: store.id },
      attributes: ["id"],
    });

    const productIds = products.map((product) => product.id);

    //const carts = await Cart.findAll({
    //  where: {
    //    product_id: {
    //      [Sequelize.Op.in]: productIds,
    //    },
    //  },
    //  attributes: ["id"],
    //});

    //const cartIds = carts.map((cart) => cart.id);

    const transactions = await Transaction.findAll({
      where: {
        user_id,
        //cart_id: {
        //  [Sequelize.Op.contains]: cartIds,
        //},
      },
      //include: [
      //  {
      //    model: Cart,
      //    as: "cart",
      //    include: [
      //      {
      //        model: Product,
      //        as: "product",
      //      },
      //    ],
      //  },
      //],
    });

    if (!transactions || transactions.length === 0) {
      return response(
        res,
        200,
        false,
        "No transactions found for this store and user",
        null
      );
    }

    return response(
      res,
      200,
      true,
      "Transactions retrieved successfully",
      transactions
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getAllTransactions;
