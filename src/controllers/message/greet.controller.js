const { User, Profile, Store } = require("../../models");
const { response } = require("../../utils/response.utils");

const sendMessageGreetSeller = async (req, res) => {
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

    const { store_phone_number } = req.body;

    const store = await Store.findOne({
      where: { phone: store_phone_number },
      attributes: ["name", "phone"],
    });

    if (!store) return response(res, 404, false, "Store or Seller phone not found", null);

    const parsedStringPhone = store.phone.split("+").pop();

    const messageTemplate = `Hi ${store.name}, I am ${buyer.name} I would like to purchase your product`;
    const waMeString = `https://wa.me/${parsedStringPhone}/?text=${encodeURIComponent(messageTemplate)}`;

    return response(res, 201, true, "Successfully Message Seller", waMeString);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = sendMessageGreetSeller;

