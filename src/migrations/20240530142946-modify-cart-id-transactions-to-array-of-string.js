"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'new_cart_id', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    // Copy data from old column to new column
    await queryInterface.sequelize.query(`
      UPDATE "Transactions"
      SET "new_cart_id" = ARRAY["cart_id"]
    `);

    await queryInterface.removeColumn('Transactions', 'cart_id');

    await queryInterface.renameColumn('Transactions', 'new_cart_id', 'cart_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "cart_id", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
