const { Product, User } = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { multiUpload } = require("../../../utils/imagekit.utils");
const path = require("path");

const imagesProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    const { product_id } = req.body;

    if (!req.body)
      return response(res, 400, false, "Request body is empty", null);

    const product = await Product.findOne({
      attributes: { exclude: ["image_product"] },
      where: { id: product_id, user_id: user.id, display: true },
    });

    const upload = await multiUpload(req, res);
    await Product.update(
      { images: upload.urls },
      { where: { id: product.id, user_id: user.id, display: true } }
    );
    const productUpdated = await Product.findOne({
      attribues: { exclude: ["image_product"] },
      where: { id: product.id, user_id: user.id, display: true },
    });

    response(res, 200, upload.success, "Successfully Update Product Image", {
      user,
      product: productUpdated,
    });
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = imagesProduct;
