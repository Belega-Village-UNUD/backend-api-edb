const getBank = require("./get-bank.controller");
const getListBank = require("./get-listbank.controller");
const createBankAccount = require("./create.controller");
const updateBankAccount = require("./update.controller");
const deleteBankAccount = require("./delete.controller");

module.exports = {
  getBank,
  getListBank,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
};
