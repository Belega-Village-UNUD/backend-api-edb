const { response } = require("../../../utils/response.utils");
const { Product, ProductType, Store, User } = require("../../../models");

const getOneProduct = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!store) {
      return response(res, 404, false, `Store Not Found`, null);
    }

    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, store_id: store.id, display: true },
      attributes: { exclude: ["image_product"] },
      include: [
        {
          model: ProductType,
          as: "product_type",
        },
        {
          model: Store,
          as: "store",
          where: {
            id: store.id,
          },
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
      `Get Product ${product.name_product} Successfull`,
      product
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getOneProduct;
