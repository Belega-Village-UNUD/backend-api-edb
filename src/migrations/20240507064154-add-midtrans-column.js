"use strict";
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Transactions", "token", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    });

    await queryInterface.addColumn("Transactions", "redirect_url", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Transactions", "token");

    await queryInterface.removeColumn("Transactions", "redirect_url");
  },
};
