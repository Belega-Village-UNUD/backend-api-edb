"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.sequelize.query(
    //   `DROP TYPE IF EXISTS "enum_Payouts_status";`
    // );

    // await queryInterface.sequelize.query(`
    //   CREATE TYPE "enum_Payouts_status" AS ENUM('PENDING', 'ONGOING', 'SUCCESS', 'CANCEL');
    // `);

    await queryInterface.createTable("Payouts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      store_id: {
        type: Sequelize.STRING,
      },
      store_bank_id: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["PENDING", "ONGOING", "SUCCESS", "CANCEL"],
      },
      payout_proof: {
        type: Sequelize.STRING,
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

    // await queryInterface.sequelize.query(`
    //   ALTER TABLE "Payouts"
    //   ALTER COLUMN "status" TYPE "enum_Payouts_status"
    //   USING (
    //     CASE
    //       WHEN "status" = '' THEN 'PENDING'::text::"enum_Payouts_status"
    //       WHEN "status" = '' THEN 'PENDING'::text::"enum_Payouts_status"
    //       ELSE 'PENDING'::text::"enum_Payouts_status"
    //     END
    //   );
    // `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payouts");
  },
};
