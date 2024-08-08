const { response } = require("../../../utils/response.utils");
const {
  getCarts,
  getSalesReport,
  getSalesReportBasedCustomDate,
  getStore,
} = require("../../../utils/orm.utils");

const getTransactionReports = async (req, res) => {
  try {
    const { id } = req.user;
    const store = await getStore(id);
    const { start_date, end_date } = req.query;
    if (!start_date && !end_date) {
      const report = await getSalesReport(store.id);
      if (!report) {
        return response(
          res,
          404,
          false,
          `Have no Transactions in ${store.name}`,
          null
        );
      }

      return response(
        res,
        200,
        true,
        "Get Transaction Reports is Success",
        report
      );
    }

    const report = await getSalesReportBasedCustomDate(
      store.id,
      start_date,
      end_date
    );

    if (!report) {
      return response(res, 404, false, `${report.message}`, null);
    }

    return response(
      res,
      200,
      true,
      `Get Transaction Reports between ${start_date} and ${end_date} is Success`,
      report
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getTransactionReports;
