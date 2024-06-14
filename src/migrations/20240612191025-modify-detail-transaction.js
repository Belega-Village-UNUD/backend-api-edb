"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("DetailTransactions", "product_id");
    await queryInterface.removeColumn("DetailTransactions", "unit_price");
    await queryInterface.removeColumn("DetailTransactions", "qty");

    await queryInterface.addColumn("DetailTransactions", "carts_details", {
      type: Sequelize.JSON,
    });

    await queryInterface.addColumn(
      "DetailTransactions",
      "sub_total_transaction_price_before_shipping",
      {
        type: Sequelize.DECIMAL,
      }
    );

    await queryInterface.addColumn("DetailTransactions", "sub_total_shipping", {
      type: Sequelize.DECIMAL,
    });

    await queryInterface.renameColumn(
      "DetailTransactions",
      "total_price",
      "total_final_price"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("DetailTransactions", "product_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("DetailTransactions", "unit_price", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
    await queryInterface.addColumn("DetailTransactions", "qty", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.removeColumn("DetailTransactions", "cart_details");

    await queryInterface.removeColumn(
      "DetailTransactions",
      "sub_total_transaction_price_before_shipping"
    );

    await queryInterface.removeColumn(
      "DetailTransactions",
      "sub_total_shipping"
    );

    await queryInterface.renameColumn(
      "DetailTransactions",
      "total_final_price",
      "total_price"
    );
  },
};
