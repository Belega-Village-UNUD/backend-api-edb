require("dotenv").config();
const { User, Role, Profile } = require("../models");
const { nanoid } = require("nanoid");
const { SELLER_ONE, SELLER_TWO, SELLER_THREE } = process.env;
("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user_one = await User.findOne({
      where: { email: SELLER_ONE },
    });
    console.log("🚀 ~ up ~ user_one:", user_one);

    const user_two = await User.findOne({
      where: { email: SELLER_TWO },
    });
    console.log("🚀 ~ up ~ user_two:", user_two);

    const user_three = await User.findOne({
      where: { email: SELLER_THREE },
    });
    console.log("🚀 ~ up ~ user_three:", user_three);

    const user = [user_one.id, user_two.id, user_three.id];

    await queryInterface.bulkInsert(
      "Stores",
      [
        {
          id: nanoid(10),
          user_id: user[0],
          avatar_link: null,
          image_link: null,
          ktp_link: "https://ik.imagekit.io/esp6kyxwz/download.jpeg",
          name: "Store Testing",
          phone: "+62123123123",
          address: "Jl Melati no F23 Desa Belega",
          description: "Testing Store for Desa Belega E-Commerce",
          unverified_reason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: nanoid(10),
          user_id: user[1],
          avatar_link: null,
          image_link: null,
          ktp_link: "https://ik.imagekit.io/esp6kyxwz/download.jpeg",
          name: "Store Bambooo The Sconed",
          phone: "+62123123123",
          address: "Jl Melati no F3234 Desa Belega",
          description: "Testing Store for Desa Belega E-Commerce",
          unverified_reason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: nanoid(10),
          user_id: user[2],
          avatar_link: null,
          image_link: null,
          ktp_link: "https://ik.imagekit.io/esp6kyxwz/download.jpeg",
          name: "John Doe Store The Third",
          phone: "+62123123123",
          address: "Jl Desa Belega no D222222",
          description: "Testing Store for Desa Belega E-Commerce",
          unverified_reason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Stores", null, {});
  },
};
