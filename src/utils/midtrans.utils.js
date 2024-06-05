const { Transaction } = require("../models");
const crypto = require("crypto");
const { MIDTRANS_SERVER_KEY } = require("./constan");

module.exports = {
  /**
   * This function is to modify the status of the transaction in the database based on the midtrans status
   *
   * @param {*} midtransStatus
   * @returns success of updating status on Transcations
   * TODO: we can do batch update to improve performance
   *
   * */
  modifyStatusTransaction: async (transactionId, midtransStatus) => {
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

    if (!transaction) {
      return status;
    }

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
  checkMidtransStatus: async (transaction) => {
    const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);
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
      return data;
    }
    return null;
  },

  updateStatusFromMidtrans: async (transaction_id, data) => {
    if (!data) {
      return { status: "FAILED", message: "Please Process the Payment" };
    }

    const hash = crypto
      .createHash("sha512")
      .update(
        `${transaction_id}${data.status_code}${data.gross_amount}${MIDTRANS_SERVER_KEY}`
      )
      .digest("hex");

    if (data.signature_key !== hash) {
      return {
        status: "FAILED",
        message: "Failed to Pay! Signature key is not match",
      };
    }

    let responseData = null;
    let transactionStatus = data.transaction_status;
    let fraudStatus = data.fraud_status;

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        let status = { status: "SUCCESS" };
        responseData = status;
      }
    } else if (transactionStatus === "settlement") {
      let status = { status: "SUCCESS" };
      responseData = status;
    }

    return responseData;
  },
};
