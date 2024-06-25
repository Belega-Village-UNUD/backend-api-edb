const { response } = require("../../utils/response.utils");
const { Store, User } = require("../../models");
const { readFileSyncJSON } = require("../../utils/file.utils");

const updateProfileStore = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, phone, address, description, city_id } = req.body;

    if (!city_id) {
      return response(res, 400, false, "Province and City is required", null);
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

    const addPhone = phone.replace(/^0/, "+62");

    const data = {
      name,
      phone: addPhone,
      address,
      description,
      province,
      city,
    };

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const store = await Store.findOne({ where: { user_id: user.id } });
    if (!store) {
      return response(res, 404, false, "Store not found", null);
    }

    await Store.update(data, { where: { user_id: user.id } });
    const updatedStore = await Store.findOne({ where: { user_id: user.id } });

    const payload = {
      user,
      updatedStore,
    };

    return response(
      res,
      200,
      true,
      `Successfully Update Store Profile ${store.name} `,
      payload
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = updateProfileStore;
