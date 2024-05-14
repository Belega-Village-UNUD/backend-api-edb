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

    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_Transactions_status";`
    );

    await queryInterface.changeColumn("Transactions", "status", {
      type: DataTypes.STRING,
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Transactions_status" AS ENUM('PENDING', 'PAYABLE', 'SUCCESS', 'CANCEL');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Transactions"
      ALTER COLUMN "status" TYPE "enum_Transactions_status"
      USING (
        CASE
          WHEN "status" = 'true' THEN 'SUCCESS'::text::"enum_Transactions_status"
          WHEN "status" = 'false' THEN 'PENDING'::text::"enum_Transactions_status"
          ELSE 'CANCEL'::text::"enum_Transactions_status"
        END
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Transactions"
      ALTER COLUMN "status" TYPE BOOLEAN
      USING (
        CASE
          WHEN "status" = 'SUCCESS' THEN true
          WHEN "status" = 'PENDING' THEN false
          ELSE false
        END
      );
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Transactions_status";
    `);

    await queryInterface.removeColumn("Carts", "unit_price", {
      type: DataTypes.DECIMAL,
    });
  },
};
