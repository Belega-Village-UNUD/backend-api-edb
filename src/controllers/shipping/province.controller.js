const path = require("path");
const fs = require("fs");
const { response } = require("../../utils/response.utils");
const { readFileSyncJSON } = require("../../utils/file.utils");

const getProvince = async (req, res) => {
  try {
    const { province } = req.query;
    let data = readFileSyncJSON("province.json");

    if (!province) {
      return response(
        res,
        200,
        true,
        "Successfully get list of province",
        data
      );
    }

    data = data.filter((item) => {
      return item.province.toLowerCase().includes(province.toLowerCase());
    });

    return response(res, 200, true, "Successfully get list of province", data);
  } catch (error) {
    return response(res, 500, false, error.message, null);
  }
};

module.exports = getProvince;
