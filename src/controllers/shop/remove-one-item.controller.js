const { Cart, Product, User, Store } = require("../../models");
const { response } = require("../../utils/response.utils");

const removeItem = async (req, res) => {
  try {
    const { id } = req.user;
    const { cart_id } = req.body;

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const cart = await Cart.findOne({
      where: {
        id: cart_id,
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

    if (!cart) {
      return response(res, 404, false, "Item not found in cart", null);
    }

    const product = await Product.findOne({
      where: { id: cart.product.id },
    });

    if (!product) {
      return response(res, 404, false, "There's no product of this id", null);
    }

    await Cart.destroy({ where: { id: cart.id } });

    return response(res, 200, true, "Successfully remove cart", null);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = removeItem;
