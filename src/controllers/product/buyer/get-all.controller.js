const { response } = require("../../../utils/response.utils");
const { User, Product, Store, ProductType } = require("../../../models");
const { Op } = require("sequelize");

const getAllProduct = async (req, res) => {
  try {
    // check the product that created by the user itself
    const store = await Store.findOne({ where: { user_id: req.user.id } });
    const product = await Product.findAll({
      where: { store_id: { [Op.not]: store.id } },
      attributes: { exclude: ["image_product"] },
      include: [
        {
          model: ProductType,
          as: "product_type",
          attributes: ["name", "material"],
        },
        {
          model: Store,
          as: "store",
          attributes: ["name", "user_id", "id"],
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

    return response(res, 200, true, `Get All Product Successfull`, product);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getAllProduct;
