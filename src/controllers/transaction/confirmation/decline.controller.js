const {
  Transaction,
  Cart,
  Product,
  User,
  Profile,
  Store,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { Op } = require("sequelize");

const decline = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { id } = req.user;

    const storeUser = await Store.findOne({
      attributes: ["id", "user_id"],
      where: { user_id: id },
    });

    if (!storeUser) {
      return response(
        res,
        404,
        false,
        "You are not a store for this transaction",
        null
      );
    }

    let transaction = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: { id: transactionId },
    });

    if (!transaction) {
      return response(
        res,
        404,
        false,
        "Transaction not found because you are not the seller of this transaction",
        null
      );
    }

    if (transaction.status !== "PENDING") {
      return response(
        res,
        400,
        false,
        "Only pending transactions can be declined",
        null
      );
    }

    let cartIds = transaction.cart_id;
    cartIds = Array.isArray(cartIds) ? cartIds : [cartIds];

    const carts = await Cart.findAll({
      where: { id: { [Op.in]: cartIds } },
    });

    for (const cart of carts) {
      if (!cart) {
        return response(res, 500, false, "There's no cart of this id", null);
      }

      const product = await Product.findOne({
        attributes: { exclude: ["image_product"] },
        where: { id: cart.product_id, display: true },
        include: [
          {
            model: Store,
            as: "store",
            attributes: ["id", "name", "user_id"],
          },
        ],
      });

      if (!product) {
        return response(res, 500, false, "There's no product of this id", null);
      }

      if (product.store.user_id === id) {
        const totalCart = cart.unit_price * cart.qty;
        transaction.total_amount -= totalCart;
      }

      product.stock += cart.qty;
      await product.save();
    }

    let statusStore = transaction.status_store || [];
    const storeIndex = statusStore.findIndex(
      (store) => store.store_id === storeUser.id
    );
    if (storeIndex === -1) {
      return response(res, 404, false, "Store not found in transaction", null);
    }

    statusStore[storeIndex] = {
      ...statusStore[storeIndex],
      status_store: "cancel",
    };

    const allStoresCancelled = statusStore.every(
      (store) => store.status_store === "cancel"
    );

    if (allStoresCancelled) {
      transaction.status = "CANCEL";
    }

    let transactionData = transaction.toJSON();
    transactionData.status_store = statusStore;
    transactionData.status = transaction.status;
    await Transaction.update(transactionData, {
      where: { id: transactionId },
    });

    return response(res, 200, true, "Transaction declined", 1);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = decline;
