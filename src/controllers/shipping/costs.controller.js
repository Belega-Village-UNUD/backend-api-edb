const {
  User,
  Profile,
  Product,
  Transaction,
  Cart,
  Store,
} = require("../../models");
const { response } = require("../../utils/response.utils");
const { estimateCosts } = require("../../utils/shipping.utils");
const { mergeTransactionData } = require("../../utils/merge.utils");
const { Op } = require("sequelize");
const { getCarts } = require("../../utils/orm.utils");

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * transaction_id = params;
 * courier = only accept tiki, jne, pos;
 *
 * @returns  object for shipping costs
 */
const checkCosts = async (req, res) => {
  try {
    const { transaction_id } = req.params;

    const couriers = ["tiki", "jne", "pos"];
    const transaction = await Transaction.findOne({
      where: { id: transaction_id },
    });

    const cartIds = transaction.cart_id;
    const carts = await getCarts(cartIds);

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id"],
      include: [
        {
          model: Profile,
          as: "userProfile",
          attributes: ["id", "city"],
        },
      ],
    });

    let costs = [];
    const transactionsData = mergeTransactionData(carts);
    for (const detail of transactionsData) {
      let productCarts = detail.carts;

      let totalAllCartWeight = 0;
      for (const cart of productCarts) {
        totalAllCartWeight += cart.total_weight_gr;
      }

      for (const courier of couriers) {
        try {
          let data = {
            detail,
            totalAllCartWeight,
            user,
            courier,
          };
          let estimation = await estimateCosts(data);
          costs.push(estimation);
        } catch (error) {
          return response(res, error.status || 500, false, error.message, null);
        }
      }
    }

    return response(res, 200, true, "Costs Calculation Success", costs);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = checkCosts;
