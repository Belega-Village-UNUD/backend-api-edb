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
    await queryInterface.removeColumn("Carts", "unit_price", {
      type: DataTypes.DECIMAL,
    });
