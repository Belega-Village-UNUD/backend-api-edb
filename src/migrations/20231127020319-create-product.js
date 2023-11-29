"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image_product: {
        type: Sequelize.STRING,
      },
      name_product: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      desc_product: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("Products");
  },
};
