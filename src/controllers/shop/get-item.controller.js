const { Cart, User, Product, Store, Transaction } = require("../../models");
const { response } = require("../../utils/response.utils");
const { Op } = require("sequelize");

const getItems = async (req, res) => {
  try {
    const { id } = req.user;

    // get the user
    const user = await User.findOne({
      where: {
        id: id,
      },
      attributes: ["id"],
    });

    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    // get all the cart id the has been in transactions
    const transactions = await Transaction.findAll({
      where: {
        user_id: user.id,
      },
      attributes: ["id", "cart_id"],
      raw: true,
    });

    // filter cart that has not been in the transaction module
    const cartItems = await Cart.findAll({
      where: {
        id: {
          [Op.notIn]: transactions.map((transaction) => transaction.cart_id),
        },
        user_id: id,
      },
      attributes: ["id", "qty"],
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "image_product",
            "name_product",
            "price",
            "stock",
            "desc_product",
            "type_id",
          ],
          include: {
            model: Store,
            as: "store",
            attributes: ["id", "name", "phone", "address", "description"],
          },
        },
      ],
    });
    return response(res, 200, true, "Cart items fetched", cartItems);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getItems;
