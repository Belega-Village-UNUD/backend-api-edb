const { response } = require("../../../utils/response.utils");
const {
  getCarts,
  getSalesReport,
  getStore,
} = require("../../../utils/orm.utils");

const getTransactionReports = async (req, res) => {
  try {
    const { id } = req.user;
    const store = await getStore(id);
    const report = await getSalesReport(store.id);
    return response(
      res,
      200,
      true,
      "Get Transaction Reports is Success",
      report
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getTransactionReports;
