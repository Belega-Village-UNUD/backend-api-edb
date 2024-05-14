"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("CustomDesigns", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image_link: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      height: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      width: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      budget: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("CustomDesigns");
  },
};
