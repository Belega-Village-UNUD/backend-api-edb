"use strict";
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Carts", "unit_price", {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_Transactions_status";`
    );
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Transactions_status" AS ENUM('PENDING', 'PAYABLE', 'SUCCESS', 'CANCEL');
    `);

    await queryInterface.sequelize.query(`
    await queryInterface.sequelize.query(`
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Transactions_status";
    `);

    await queryInterface.removeColumn("Carts", "unit_price", {
      type: DataTypes.DECIMAL,
    });
  },
};
