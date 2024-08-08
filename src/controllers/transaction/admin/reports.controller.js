const { response } = require("../../../utils/response.utils");
const {
  getAllSalesReport,
  getAllSalesReportBasedCustomDate,
} = require("../../../utils/orm.utils");

const getAllTransactionsReports = async (req, res) => {
  try {
    const { id } = req.user;
    const { start_date, end_date } = req.query;
    if (!start_date && !end_date) {
      const report = await getAllSalesReport();
      if (!report) {
        return response(res, 404, false, `There are no transactions`, null);
      }

      return response(
        res,
        200,
        true,
        "Get Transaction Reports is Success",
        report
      );
    }

    const report = await getAllSalesReportBasedCustomDate(start_date, end_date);

    if (!report) {
      return response(res, 404, false, `${report.message}`, null);
    }

    return response(res, 200, true, report.message, report.data);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getAllTransactionsReports;
