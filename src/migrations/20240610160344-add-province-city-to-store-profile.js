"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Stores", "province", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("Stores", "city", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Stores", "province");
    await queryInterface.removeColumn("Stores", "city");
  },
};
