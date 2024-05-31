const { response } = require("../../../utils/response.utils");
const { Product, ProductType, Store, User } = require("../../../models");

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id: id },
      attributes: ["name_product"],
      include: [
        {
          model: ProductType,
          as: "product_type",
          attributes: ["name", "material"],
        },
        {
          model: Store,
          as: "store",
          attributes: ["id", "name", "user_id", "phone"],
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
      return response(
        res,
        404,
        false,
        `Product ${product.name_product} Not Found`,
        null
      );
    }
    return response(
      res,
      200,
      true,
      `Get product ${product.name_product} Successfull`,
      product
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getOneProduct;
