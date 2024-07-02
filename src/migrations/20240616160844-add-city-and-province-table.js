'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("City", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      province: {
        allowNull: false,
        type: Sequelize.JSON,
      },
    });
    await queryInterface.createTable("City", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      province: {
        allowNull: false,
        type: Sequelize.JSON,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Province");
    await queryInterface.dropTable("City");
  }
};
