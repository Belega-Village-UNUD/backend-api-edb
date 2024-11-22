const { response } = require("../../../utils/response.utils");
const {
  User,
  Invoice,
  DetailTransaction,
  Transaction,
  Store,
  Profile,
} = require("../../../models");

const invoiceTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const profile = await Profile.findOne({ where: { user_id } });

    const { transaction_id, store_id } = req.query;
    if (!transaction_id || !store_id) {
      return response(res, 400, false, "Invalid request", null);
    }

    const store = await Store.findOne({
      where: { id: store_id },
      include: [{ model: User, as: "user" }],
    });

    const detailTransaction = await DetailTransaction.findOne({
      where: { transaction_id },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
    });

    const cartDetailStore = detailTransaction.carts_details.filter(
      (cartDetail) => cartDetail.store_id == store_id
    );

    const storeOrigin = `${
      cartDetailStore[0].origin.city_name.charAt(0).toUpperCase() +
      cartDetailStore[0].origin.city_name.slice(1)
    }, ${cartDetailStore[0].origin.province} (${
      cartDetailStore[0].origin.postal_code
    })`;

    const buyerOrigin = `${
      cartDetailStore[0].destination.city_name.charAt(0).toUpperCase() +
      cartDetailStore[0].destination.city_name.slice(1)
    }, ${cartDetailStore[0].destination.province} (${
      cartDetailStore[0].destination.postal_code
    })`;

    const invoice = await Invoice.findOne({
      where: { detail_transaction_id: detailTransaction.id },
    });

    const payloadInvoice = {
      id: invoice.id,
      transaction_id: detailTransaction.transaction.id,
      store_name: cartDetailStore[0].store_name,
      store_address: `${
        store.address.charAt(0).toUpperCase() + store.address.slice(1)
      }, ${storeOrigin}.`,
      store_email: store.user.email,
      buyer_name: profile.name,
      buyer_address: `${profile.address}, ${buyerOrigin}.`,
      buyer_email: user.email,
      shipping_method: invoice.shipping_method,
      shipping_price: invoice.shipping_price,
      total_price: invoice.total_price,
      cart_detail: cartDetailStore[0].carts,
    };

    return response(res, 200, true, "Success get invoice.", payloadInvoice);
  } catch (error) {
    return response(res, 500, false, error.message, null);
  }
};

module.exports = invoiceTransaction;
