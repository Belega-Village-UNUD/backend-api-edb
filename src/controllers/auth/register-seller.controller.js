const { User, Store } = require("../../models");
const { response } = require("../../utils/response.utils");
const { nanoid } = require("nanoid");
const { singleUpload } = require("../../utils/imagekit.utils");

const registerSeller = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, phone, address, description } = req.body;

    // Validate input data
    if (!name || !phone || !address || !description) {
      return response(res, 400, false, "Invalid input data", null);
    }

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const avatar_link = await singleUpload(req, res);
    const image_link = await singleUpload(req, res);
    const ktp_link = await singleUpload(req, res);

    if (!avatar_link || !image_link || !ktp_link) {
      return response(res, 400, false, "File upload failed", null);
    }

    const storeExist = await Store.findOne({ where: { name } });
    if (storeExist) {
      return response(res, 400, false, "Store name already used", null);
    }

    const store = await Store.create({
      id: nanoid(10),
      user_id: user.id,
      avatar_link: avatar_link.url,
      image_link: image_link.url,
      ktp_link: ktp_link.url,
      name,
      phone,
      address,
      description,
      unverified_reason: "Waiting for verification",
    });

    return response(
      res,
      201,
      true,
      "Register Seller Succces, please wait for your store verification",
      { store }
    );
  } catch (err) {
    console.error(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = registerSeller;
