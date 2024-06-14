const { response } = require("../../utils/response.utils");
const { RAJAONGKIRAPI_KEY, RAJAONGKIRAPI_URL } = require("../../utils/constan");

const getProvince = async (req, res) => {
  try {
    const url = `${RAJAONGKIRAPI_URL}/province`;
    const headerKey = new Headers();
    headerKey.append("key", RAJAONGKIRAPI_KEY);
    const provincesResponse = await fetch(url, {
      method: "GET",
      headers: headerKey,
    });

    const provinces = await provincesResponse.json(); // Parse the response as JSON
    const data = provinces.rajaongkir.results;

    return response(res, 200, true, "Successfully get list of province", data);
  } catch (error) {
    return response(res, 500, false, error.message, null);
  }
};

module.exports = getProvince;
