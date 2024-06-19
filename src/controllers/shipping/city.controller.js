const { response } = require("../../utils/response.utils");
const { readFileSyncJSON } = require("../../utils/file.utils");

const getCity = async (req, res) => {
  try {
    const { province_id } = req.query;
    let data = readFileSyncJSON("city.json");

    if (!province_id) {
      return response(res, 400, false, "Please provide province id", null);
    }

    data = data.filter((item) => {
      return item.province_id.toLowerCase() == province_id.toLowerCase();
    });

    return response(res, 200, true, "Successfully get list of city", data);
  } catch (error) {
    return response(res, 500, false, error.message, null);
  }
};

module.exports = getCity;
