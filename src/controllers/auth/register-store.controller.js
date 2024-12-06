const { User, Store } = require("../../models");
const { response } = require("../../utils/response.utils");
const { nanoid } = require("nanoid");
const { singleUpload } = require("../../utils/imagekit.utils");
const { readFileSyncJSON } = require("../../utils/file.utils");

const registerStore = async (req, res) => {
  try {
    validateRequestBody(req);
    const { id } = req.user;
    const { name, phone, address, description, city_id } = req.body;

    if (!name || !phone || !address || !description || !city_id) {
      return response(res, 400, false, "Invalid input data", null);
    }

    let cityList = readFileSyncJSON("city.json");

    const cityData = cityList.filter((item) => {
      return item.city_id.toLowerCase() === city_id.toLowerCase();
    });

    const province = {
      province_id: cityData[0].province_id,
      province: cityData[0].province,
    };

    const city = cityData[0];

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    if (user.is_verified != true) {
      return response(
        res,
        404,
        false,
        "You must be verified to register a store",
        null
      );
    }

    const existedStore = await Store.findOne({ where: { user_id: id } });
    if (existedStore) {
      return response(res, 400, false, "Store already registered", null);
    }

    const storeNameExist = await Store.findOne({ where: { name } });
    if (storeNameExist) {
      return response(res, 400, false, "Store name already used", null);
    }

    const ktp_link = await singleUpload(req, res);
    if (!ktp_link) {
      return response(res, 400, false, "File upload failed", null);
    }

    const addPhone = phone.replace(/^0/, "+62");

    const store = await Store.create({
      id: nanoid(10),
      user_id: user.id,
      avatar_link: null,
      image_link: null,
      ktp_link: ktp_link.url,
      name,
      phone: addPhone,
      address,
      description,
      unverified_reason: null,
      is_verified: "WAITING",
      province,
      city,
    });

    return response(
      res,
      200,
      true,
      "Register Store Success, please wait for your store verification",
      { store }
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = registerStore;
