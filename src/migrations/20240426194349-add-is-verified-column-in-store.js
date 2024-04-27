'use strict';
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // drop the enum type of transactions
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_Stores_is_verified";`
    );

    await queryInterface.addColumn("Stores", "is_verified", {
      type: DataTypes.STRING,
      after: "description",
    });

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Stores_is_verified" AS ENUM('WAITING', 'FEE', 'VERIFIED', 'DECLINED');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Stores"
      ALTER COLUMN "is_verified" TYPE "enum_Stores_is_verified"
      USING (
        CASE
          WHEN "unverified_reason" = 'null' THEN 'WAITING'::text::"enum_Stores_is_verified"
          WHEN "unverified_reason" = 'Waiting for verification' THEN 'WAITING'::text::"enum_Stores_is_verified"
          ELSE 'WAITING'::text::"enum_Stores_is_verified"
        END
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Stores"
      ALTER COLUMN "is_verified" SET NOT NULL;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Stores", "is_verified");

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Stores_is_verified";
    `);
  }
};
