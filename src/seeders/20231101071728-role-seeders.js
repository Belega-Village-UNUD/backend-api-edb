"use strict";
var { ROLE, MODULE } = require("../utils/enum.utils");
var { Role, Module, Access, User, Profile } = require("../models");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let property in ROLE) {
      let role = await Role.findOne({ where: { name: property } });
      if (!role) {
        await Role.create({ id: nanoid(10), name: property });
      }
    }

    for (let property in MODULE) {
      let module = await Module.findOne({ where: { name: property } });
      if (!module) {
        await Module.create({ id: nanoid(10), name: property });
      }
    }

    const admin = await User.findOne({
      where: { email: "superadmin@mail.com" },
    });

    if (!admin) {
      const password = await bcrypt.hash("password", 10);
      const roleAdmin = await Role.findOne({ where: { name: ROLE.ADMIN } });
      const roleUser = await Role.findOne({ where: { name: ROLE.USER } });

      const admin = await User.create({
        id: nanoid(10),
        email: "superadmin@mail.com",
        password: password,
        role_id: [roleAdmin.id, roleUser.id],
        is_verified: true,
      });

      await Profile.create({
        id: nanoid(10),
        user_id: admin.id,
        avatar_link: null,
        name: "admin",
        phone: null,
        address: null,
        description: "This is the admin",
      });
    }

    for (let property in MODULE) {
      const module = await Module.findOne({ where: { name: property } });
      const roleAdmin = await Role.findOne({ where: { name: ROLE.ADMIN } });
      var roleUser = await Role.findOne({ where: { name: ROLE.USER } });

      const access = await Access.findOne({
        where: { role_id: roleAdmin.id, module_id: module.id },
      });

      if (!access) {
        await Access.create({
          id: nanoid(10),
          role_id: roleAdmin.id,
          module_id: module.id,
          read: true,
          write: true,
        });
      }

      var userAccess = await Access.findOne({ where: { role_id: roleUser.id, module_id: module.id } });
      if (!userAccess) {
        await Access.create({
          id: nanoid(10),
          role_id: roleUser.id,
          module_id: module.id,
          read: true,
          write: false,
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Roles", null, {});
    await queryInterface.bulkDelete("Modules", null, {});
    await queryInterface.bulkDelete("Accesses", null, {});
    await queryInterface.bulkDelete("Profiles", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
