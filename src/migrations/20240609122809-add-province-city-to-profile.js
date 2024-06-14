"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "province", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("Profiles", "city", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Profiles", "province");
    await queryInterface.removeColumn("Profiles", "city");
  },
};
