const { Cart, Product } = require("../../models");
const { response } = require("../../utils/response.utils");

const removeItem = async (req, res) => {
  try {
    const { id } = req.user;
    const { product_id, qty } = req.body;

    const cart = await Cart.findOne({ where: { user_id: id, product_id } });

    if (!cart) {
      return response(res, 404, false, "Item not found in cart", null);
    }

    const product = await Product.findOne({
      where: { id: cart.product_id },
    });

    if (!product) {
      return response(res, 404, false, "There's no product of this id", null);
    }

    product.stock += qty;
    await product.save();

    if (cart.qty > qty) {
      await cart.update({ qty: cart.qty - qty });
      return response(res, 200, true, "Cart item quantity updated", null);
    }

    return response(res, 200, true, "Cart Item was Updated", null);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = removeItem;
