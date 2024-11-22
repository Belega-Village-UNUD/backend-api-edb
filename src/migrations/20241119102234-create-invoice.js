"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Invoices", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      detail_transaction_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      store_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      shipping_method: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      shipping_price: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      total_price: {
        allowNull: false,
        type: Sequelize.DECIMAL,
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
    await queryInterface.dropTable("Invoices");
  },
};
