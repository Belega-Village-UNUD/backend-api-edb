"use strict";
var { ROLE, MODULE } = require("../utils/enum.utils");
var { Role, Module, Access, User, Profile } = require("../models");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const { BELEGA_ADMIN_EMAIL, BELEGA_ADMIN_PASSWORD } = process.env;

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check the Role if the Role is not defined in database, then create the Role based on the enum.utils.js
    for (let property in ROLE) {
      let role = await Role.findOne({ where: { name: property } });
      if (!role) {
        await Role.create({ id: nanoid(10), name: property });
      }
    }

    // Check the Module if the Module is not defined in database, then create the Role based on the enum.utils.js
    for (let property in MODULE) {
      let module = await Module.findOne({ where: { name: property } });
      if (!module) {
        await Module.create({ id: nanoid(10), name: property });
      }
    }

    // Check the admin account in database
    const admin = await User.findOne({
      where: { email: BELEGA_ADMIN_EMAIL },
    });

    // if there's no admin then create the admin account
    if (!admin) {
      const password = await bcrypt.hash(BELEGA_ADMIN_PASSWORD, 10);
      const roleAdmin = await Role.findOne({ where: { name: ROLE.ADMIN } });
      const roleBuyer = await Role.findOne({ where: { name: ROLE.BUYER } });

      const admin = await User.create({
        id: nanoid(10),
        email: BELEGA_ADMIN_EMAIL,
        password: password,
        role_id: [roleAdmin.id, roleBuyer.id],
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

    // Loop through the module
    for (let property in MODULE) {
      // check the module, admin role, and access in the database
      const module = await Module.findOne({ where: { name: property } });
      const roleAdmin = await Role.findOne({ where: { name: ROLE.ADMIN } });

      const access = await Access.findOne({
        where: { role_id: roleAdmin.id, module_id: module.id },
      });

      // if there's no module access defined in the database
      // then create the access expect
      // set the read and write to false for seller module
      if (!access) {
        await Access.create({
          id: nanoid(10),
          role_id: roleAdmin.id,
          module_id: module.id,
          read: property === MODULE.SELLER ? false : true,
          write: property === MODULE.SELLER ? false : true,
        });
      }

      // check the property value is it module SELLER or ADMIN.
      if (property === MODULE.SELLER || property === MODULE.ADMIN) {
        // check the buyer
        var roleBuyer = await Role.findOne({ where: { name: ROLE.BUYER } });
        var roleSeller = await Role.findOne({ where: { name: ROLE.SELLER } });
        var buyerAccess = await Access.findOne({
          where: { role_id: roleBuyer.id, module_id: module.id },
        });
        var sellerAccess = await Access.findOne({
          where: { role_id: roleBuyer.id, module_id: module.id },
        });
        // check if the property is ADMIN module
        if (property === MODULE.ADMIN) {
          // create the seller access
          if (!sellerAccess) {
            await Access.create({
              id: nanoid(10),
              role_id: roleSeller.id,
              module_id: module.id,
              read: false,
              write: false,
            });
          }
          // create the buyer access
          if (!buyerAccess) {
            await Access.create({
              id: nanoid(10),
              role_id: roleBuyer.id,
              module_id: module.id,
              read: false,
              write: false,
            });
          }
        }
      } else {
        if (!sellerAccess) {
          await Access.create({
            id: nanoid(10),
            role_id: roleSeller.id,
            module_id: nanoid(10),
            read: true,
            write: true,
          });
        }
      }
      if (property === MODULE.PRODUCT) {
        await Access.create({
          id: nanoid(10),
          role_id: roleBuyer.id,
          module_id: module.id,
          read: true,
          write: false,
        });
      } else {
        await Access.create({
          id: nanoid(10),
          role_id: roleBuyer.id,
          module_id: module.id,
          read: true,
          write: true,
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
    await queryInterface.bulkDelete("OTPs", null, {});
  },
};
