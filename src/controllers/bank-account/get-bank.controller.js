const { response } = require("../../utils/response.utils");
const {
  checkAdmin,
  getBankStore,
  getBankAdmin,
} = require("../../utils/orm.utils");

const getBank = async (req, res) => {
  try {
    const { id } = req.user;
    const { store_id, store_bank_id } = req.query;
    const isAdmin = await checkAdmin(id);
    let data;

    if (isAdmin) {
      data = await getBankAdmin(store_id, store_bank_id);
    } else {
      data = await getBankStore(id, store_bank_id);
    }

    if (!data) {
      return response(res, 404, false, "Bank not found", null);
    }

    return response(res, 200, true, "List of bank", data);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getBank;
