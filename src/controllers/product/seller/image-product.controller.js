const { Product, User } = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { singleUpload } = require("../../../utils/imagekit.utils");

const imageProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    const upload = await singleUpload(req, res);
    await Product.update(
      { image_product: upload.url },
      { where: { user_id: user.id } }
    );
    const product = await Product.findOne({ where: { user_id: user.id } });
    response(res, 200, upload.success, "Successfully Update Product Image", {
      user,
      product,
    });
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = imageProduct;
