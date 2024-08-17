const { response } = require("../../utils/response.utils");
const { getStoreInfo: getStoreInformation } = require("../../utils/orm.utils");

const getStoreInfo = async (req, res) => {
  try {
    const { store_id } = req.query;

    if (!store_id) {
      return response(res, 400, true, `Please provide your store id`, null);
    }

    const store = await getStoreInformation(store_id);

    if (!store) {
      return response(res, 404, false, "Your requested store is empty", null);
    }

    return response(res, 200, true, `Get Store Successfull`, store.data);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getStoreInfo;
