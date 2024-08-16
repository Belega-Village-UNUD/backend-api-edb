const { response } = require("../../../utils/response.utils");
const { User, Product, Store, ProductType } = require("../../../models");

const getAllProduct = async (req, res) => {
  try {
    const { store_id } = req.query;

    if (!store_id) {
      const product = await Product.findAll({
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

      return response(res, 200, true, `Get All Product Successfull`, product);
    }

    const store = await Store.findOne({ where: { id: store_id } });

    const product = await Product.findAll({
      where: { store_id: store.id },
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
      return response(res, 404, false, `Product Not Found`, null);
    }

    return response(
      res,
      200,
      true,
      `Get All Product from ${store.name} Successfull`,
      product
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getAllProduct;
