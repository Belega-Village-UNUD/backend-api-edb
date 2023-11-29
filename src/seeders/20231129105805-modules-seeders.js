'use strict';
var { ROLE, MODULE } = require("../utils/enum.utils");
var { Role, Module, Access } = require("../models");

module.exports = {
  async up (queryInterface, Sequelize) {
    for (let property in ROLE) {
      let role = await Role.findOne({ where: { name: property } });
      if (!role) { await Role.create({ id: nanoid(10), name: property }); }
    }

    for (let property in MODULE) {
      let module = await Module.findOne({ where: { name: property } });
      if (!module) { await Module.create({ id: nanoid(10), name: property }); }
    }

    for (let property in MODULE) {
      const module = await Module.findOne({ where: { name: property } });
      const roleSeller = await Role.findOne({ where: { name: ROLE.SELLER } });
      var roleUser = await Role.findOne({ where: { name: ROLE.USER } });

      const access = await Access.findOne({
        where: { role_id: roleSeller.id, module_id: module.id },
      });

      if (!access) {
        await Access.create({
          id: nanoid(10),
          role_id: roleSeller.id,
          module_id: module.id,
          read: true,
          write: true,
        })
      }

      const accessUser = await Access.findOne({
        where: { role_id: roleUser.id, module_id: module.id },
      });
      if (!accessUser) {
        await Access.create({
          id: nanoid(10),
          role_id: roleUser.id,
          module_id: module.id,
          read: true,
          write: false,
        })
      }
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Accesses', null, {});
    await queryInterface.bulkDelete('Modules', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
