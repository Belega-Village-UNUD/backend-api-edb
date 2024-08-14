"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.renameColumn("FeeHistories", "seller_id", "store_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("FeeHistories", "store_id", "seller_id");
  },
};
