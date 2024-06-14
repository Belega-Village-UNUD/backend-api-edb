const { response } = require("../../utils/response.utils");
const { RAJAONGKIRAPI_KEY, RAJAONGKIRAPI_URL } = require("../../utils/constan");

const getCity = async (req, res) => {
  try {
    const { province_id } = req.params;
    const url = `${RAJAONGKIRAPI_URL}/city?province=${province_id}`;
    const headerKey = new Headers();
    headerKey.append("key", RAJAONGKIRAPI_KEY);
    const citiesResponse = await fetch(url, {
      method: "GET",
      headers: headerKey,
    });

    const cities = await citiesResponse.json();
    const data = cities.rajaongkir.results;

    return response(res, 200, true, "Successfully get list of city", data);
  } catch (error) {
    return response(res, 500, false, error.message, null);
  }
};

module.exports = getCity;
