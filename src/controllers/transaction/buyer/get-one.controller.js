const {
  Transaction,
  DetailTransaction,
  User,
  Profile,
} = require("../../../models");
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
    let shippingMethod = null;

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
          if (cartWithStatus.shipping) {
            shippingMethod = `${
              cartWithStatus.shipping.code.charAt(0).toUpperCase() +
              cartWithStatus.shipping.code.slice(1)
            } ${cartWithStatus.shipping.service} (${
              cartWithStatus.shipping.description
            })`;
          } else {
            shippingMethod = "Unknown Shipping Method";
          }
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
          address: `${cart.user.userProfile.address}, ${cart.user.userProfile.city.city_name}, ${cart.user.userProfile.city.province}, ${cart.user.userProfile.city.postal_code}`,
          shipping_method: shippingMethod,
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
