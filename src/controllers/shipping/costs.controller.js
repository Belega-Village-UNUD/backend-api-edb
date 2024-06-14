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
const { mergeTransactionData } = require("../../utils/merge-tx-data");
const { Op } = require("sequelize");

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
        id: { [Op.in]: transaction.cart_id },
      },
    });

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

      for (const cart of productCarts) {
        for (const courier of couriers) {
          const data = {
            detail,
            cart,
            user,
            courier,
          };

          try {
            let estimation = await estimateCosts(data);
            costs.push(estimation);
          } catch (error) {
            return response(
              res,
              error.status || 500,
              false,
              error.message,
              null
            );
          }
        }
      }
    }

    return response(res, 200, true, "Costs Calculation Success", costs);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = checkCosts;
