"use strict";
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.STRING,
        allowNull: false,
        allowNull: false,
      },
      type_id: {
        type: Sequelize.STRING,
        allowNull: false,
        allowNull: false,
      },
      image_product: {
        type: Sequelize.STRING,
        type: Sequelize.STRING,
      },
      name_product: {
        type: Sequelize.STRING,
        allowNull: false,
        allowNull: false,
      },
      desc_product: {
        type: Sequelize.TEXT,
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
    await queryInterface.dropTable("Products");
  },
};

