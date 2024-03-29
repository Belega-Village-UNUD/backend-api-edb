const { Cart, User, Product, Store } = require("../../models");
const { response } = require("../../utils/response.utils");

const getItems = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    const items = await Cart.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    const cartItems = await Promise.all(
      items.map(async (item) => {
        const { id, quantity, product_id } = item;
        const product = await Product.findOne({
          where: { id: product_id },
          attributes: [
            "id",
            "image_product",
            "name_product",
            "price",
            "stock",
            "desc_product",
            "type_id",
          ],
          include: [
            {
              model: Store,
              as: "store",
              attributes: ["id", "name", "phone", "address", "description"],
            },
          ],
        });
        return {
          id,
          quantity,
          product,
        };
      })
    );

    return response(res, 200, true, "Cart items fetched", cartItems);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getItems;
