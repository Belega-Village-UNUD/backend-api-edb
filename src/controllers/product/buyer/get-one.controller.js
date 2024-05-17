const { response } = require("../../../utils/response.utils");
const { Product, ProductType, Store, User } = require("../../../models");
const { Op } = require('sequelize');

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findOne({ where: { user_id: req.user.id } });

    const product = await Product.findOne({
      where: { id, store_id: {[Op.not]: store.id} },
      include: [
        {
          model: ProductType,
          as: "product_type",
        },
        {
          model: Store,
          as: "store",
          attributes: ["id", "name", "user_id"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email"],
            },
          ],
        },
      ],
    });

    if (!product) {
      return response(res, 404, false, `Product Not Found`, null);
    }
    return response(res, 200, true, `Get Product ${id} Successfull`, product);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getOneProduct;
