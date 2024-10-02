const { Transaction, DetailTransaction, User } = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { getTransactionBuyerOne } = require("../../../utils/orm.utils");

const getOneTransactions = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;

    const user = await User.findOne({ where: { id: user_id } });

    const transaction = await getTransactionBuyerOne(user.id, transaction_id);

    let updatedCarts = [];
    let arrivalShippingStatus = "UNCONFIRMED";

    const detailTransaction = await DetailTransaction.findAll({
      where: {
        transaction_id: transaction.data.id,
        "$transaction.user_id$": user.id,
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
          attributes: ["id"],
        },
      ],
      attributes: ["id", "carts_details"],
    });

    if (detailTransaction.length > 0) {
      const detailWithStatus = detailTransaction.find(
        (detail) => detail.carts_details.length
      );
      if (detailWithStatus) {
        const cartWithStatus = detailWithStatus.carts_details.find(
          (cart) => cart.arrival_shipping_status
        );
        if (cartWithStatus) {
          arrivalShippingStatus = cartWithStatus.arrival_shipping_status;
        }
      }
    }

    transaction.data.cart_details.forEach(async (cart) => {
      if (cart.id) {
        const newCart = {
          unit_price: cart.unit_price,
          id: cart.id,
          user_id: cart.user_id,
          product_id: cart.product_id,
          qty: cart.qty,
          arrival_shipping_status: arrivalShippingStatus,
          user: cart.user,
          product: cart.product,
        };
        updatedCarts.push(newCart);
      }
    });

    transaction.data.cart_details = updatedCarts;

    return response(res, 200, true, transaction.message, transaction.data);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getOneTransactions;
