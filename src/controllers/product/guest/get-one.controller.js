const { response } = require("../../../utils/response.utils");
const { Product, ProductType, Store, User } = require("../../../models");

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id: id, display: true },
      attributes: { exclude: ["image_product"] },
      include: [
        {
          model: ProductType,
          as: "product_type",
        },
        {
          model: Store,
          as: "store",
          attributes: { exclude: ["ktp_link"] },
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
