"use strict";
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "token", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.changeColumn("Transactions", "redirect_url", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "token", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    });

    await queryInterface.changeColumn("Transactions", "redirect_url", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    });
  },
};
