const { Transaction } = require("../models");
const { MIDTRANS_SERVER_KEY } = require("./constan");

module.exports = {
  /**
   * This function is to modify the status of the transaction based on the midtrans status
   *
   * @param {*} midtransStatus
   * @returns success of updating status on Transcations
   * TODO: we can do batch update to improve performance
   *
   * */
  modifyStatus: async (transactionId, midtransStatus) => {
    let status;
    if (midtransStatus === "capture") {
      status = "SUCCESS";
    } else if (midtransStatus === "settlement") {
      status = "SUCCESS";
    } else if (midtransStatus === "pending") {
      status = "PENDING";
    } else if (midtransStatus === "deny") {
      status = "CANCEL";
    } else if (midtransStatus === "cancel") {
      status = "CANCEL";
    } else if (midtransStatus === "expire") {
      status = "CANCEL";
    } else if (midtransStatus === "refund") {
      status = "CANCEL";
    } else {
      status = "CANCEL";
    }

    const transaction = await Transaction.update(
      { status: status },
      { where: { id: transactionId } }
    );

    console.log("36, modifyStatus: transactions", transaction);
    return status;
  },

  /**
   * Check midtrans status of transaction
   * The purpose of this function is to check the status of the transaction from midtrans
   * and update the status of the transaction in the database
   *
   * @param {*} transaction_id
   * @returns data JSON response of transaction data from midtrans
   *
   */
  checkMidtransStatus: async (transactions) => {
    const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);
    for (const transaction of transactions) {
      const url = `https://api.sandbox.midtrans.com/v2/${transaction.id}/status`;
      const transactionStatus = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authString}`,
        },
      });

      const data = await transactionStatus.json();

      const status_code = parseInt(data.status_code);

      const isNotAvailable = status_code === 404 ? true : false;
      if (!isNotAvailable) {
        const newStatus = await module.exports.modifyStatus(
          transaction.id,
          data.transaction_status
        );
        console.log("48, transactionStatus: newStatus:", newStatus);
      }
    }
  },
};
