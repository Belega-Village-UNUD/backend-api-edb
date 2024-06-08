"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "CancelledTransactions",
      "cancelled_reason",
      "reason"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "CancelledTransactions",
      "reason",
      "cancelled_reason"
    );
  },
};
