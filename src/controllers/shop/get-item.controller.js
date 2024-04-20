const { Cart, User, Product, Store } = require("../../models");
const { response } = require("../../utils/response.utils");

const getItems = async (req, res) => {
  try {
    const { id } = req.user;
    const cartItems = await Cart.findAll({
      where: { user_id: id },
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
          include: [
            {
              model: Store,
              as: "store",
              attributes: ["id", "name", "phone", "address", "description"],
            },
          ],
        },
      ],
    });

    return response(res, 200, true, "Cart items fetched", cartItems);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getItems;
