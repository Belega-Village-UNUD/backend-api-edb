'use strict';
var { ROLE, MODULE } = require("../utils/enum.utils");
var { Role, Module } = require("../models");

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
  },

  async down (queryInterface, Sequelize) {
    
  }
};
