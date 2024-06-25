"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StoreBankAccounts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      store_id: {
        type: Sequelize.STRING,
      },
      bank_name: {
        type: Sequelize.STRING,
      },
      bank_code: {
        type: Sequelize.STRING,
      },
      account_number: {
        type: Sequelize.STRING,
      },
      account_name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("StoreBankAccounts");
  },
};
