const { User, Profile, Store, Product } = require("../../models");
const { response } = require("../../utils/response.utils");

const sendMessageAskProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id: id },
      attributes: { exclude: ["password"] },
    });

    const buyer = await Profile.findOne({
      where: { user_id: user.id },
      attributes: ["name"],
    });

    if (!buyer) return response(res, 404, false, "User not found", null);

    const { product_id } = req.body;

    const product = await Product.findOne({
      where: { id: product_id, display: true },
      attributes: ["id", "store_id"],
    });

    if (!product) return response(res, 404, false, "Product not found", null);

    const store = await Store.findOne({
      where: { id: product.store_id },
      attributes: ["name", "phone"],
    });

    if (!store)
      return response(res, 404, false, "Store or Seller phone not found", null);

    const parsedStringPhone = store.phone.split("+").pop();
    // TODO change to frontend url for product
    const messageTemplate = `Hi ${store.name}, I am ${buyer.name} I would like to ask the availibility of this product [example of url]/${product.id}`;
    const waMeString = `https://wa.me/${parsedStringPhone}/?text=${encodeURIComponent(
      messageTemplate
    )}`;

    return response(res, 201, true, "Successfully Message Seller", waMeString);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = sendMessageAskProduct;
