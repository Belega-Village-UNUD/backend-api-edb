const { User, Profile } = require("../../models");
const { response } = require("../../utils/response.utils");
const { readFileSyncJSON } = require("../../utils/file.utils");

const updateUser = async (req, res) => {
  try {
    const { email } = req.user;
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

    const data = {
      name,
      phone,
      address,
      description,
      province,
      city,
    };

    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ["password"] },
    });

    await Profile.update(data, { where: { user_id: user.id } });
    const profile = await Profile.findOne({ where: { user_id: user.id } });

    const payload = {
      user,
      profile,
    };
    return response(res, 200, true, "Successfully update profile", payload);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = updateUser;
