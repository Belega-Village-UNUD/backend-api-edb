const { Cart, User, Product, Transaction, Store } = require("../../models");
const { response } = require("../../utils/response.utils");
const { Op } = require("sequelize");

const removeAll = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
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
    const carts = await Cart.findAll({
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
            "images",
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

    if (carts.length === 0) {
      return response(res, 200, true, "No items in cart", null);
    }

    // loop through cart
    for (const cart of carts) {
      let product = await Product.findOne({
        where: { id: cart.product.id, display: true },
      });
      if (!product) {
        return response(res, 404, false, "There's no product of this id", null);
      }
      // product.stock += cart.qty;
      // await product.save();
      await Cart.destroy({
        where: { id: cart.id },
      });
    }

    return response(
      res,
      200,
      true,
      "All items removed from Current Cart that not checkouted",
      null
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = removeAll;
