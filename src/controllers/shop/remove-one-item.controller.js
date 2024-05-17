const { Cart, Product, User, Transaction } = require("../../models");
const { response } = require("../../utils/response.utils");

const removeItem = async (req, res) => {
  try {
    const { id } = req.user;
    const { product_id } = req.body;

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const transactions = await Transaction.findAll({
      where: {
        user_id: user.id,
      },
      attributes: ["id", "cart_id"],
      raw: true,
    });

    const cart = await Cart.findOne({
      where: {
        id: {
          [Op.notIn]: transactions.map((transaction) => transaction.cart_id),
        },
        user_id: id,
        product_id,
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

    if (!cart) {
      return response(res, 404, false, "Item not found in cart", null);
    }

    const product = await Product.findOne({
      where: { id: cart.product.id },
    });

    if (!product) {
      return response(res, 404, false, "There's no product of this id", null);
    }

    //if (cart.qty > qty) {
    //  await cart.update({ qty: cart.qty - qty });
    //  return response(res, 200, true, "Success reduce item", null);
    //}

    await Cart.delete({ where: { id: cart.id } });

    return response(res, 200, true, "Your cart are removed", null);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = removeItem;
