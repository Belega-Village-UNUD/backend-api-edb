const { response } = require("../../../utils/response.utils");
const { User, Product, Store, ProductType } = require("../../../models");

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.findAll({
      attributes: [
        "id",
        "user_id",
        "store_id",
        "type_id",
        "image_product",
        "name_product",
        "desc_product",
        "price",
        "stock",
      ],
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
