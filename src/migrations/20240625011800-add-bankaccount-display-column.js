"use strict";
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("StoreBankAccounts", "display", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("StoreBankAccounts", "display");
  },
};
