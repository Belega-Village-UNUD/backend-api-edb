/** 
"use strict";
var { ROLE, MODULE } = require("../utils/enum.utils");
var { Role, Module, Access } = require("../models");
const { nanoid } = require("nanoid");

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

    for (let property in MODULE) {
      const module = await Module.findOne({ where: { name: property } });
      var roleUser = await Role.findOne({ where: { name: ROLE.USER } });

      const shopAccessUser = await Access.findOne({
        where: { role_id: roleUser.id, module_id: module.id },
      });
      if (!shopAccessUser) {
        await Access.create({
          id: nanoid(10),
          role_id: roleUser.id,
          module_id: module.id,
          read: true,
          write: true,
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Accesses", null, {});
    await queryInterface.bulkDelete("Modules", null, {});
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
 */
