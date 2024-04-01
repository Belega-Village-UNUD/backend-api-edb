const { Role, Module, Access } = require("../models");
const { response } = require("../utils/response.utils");
const { Op } = require("sequelize");

const rbac = (
  moduleName,
  roleName,
  readAccess = false,
  writeAccess = false
) => {
  return async (req, res, next) => {
    // ketik write access true dia tidak melihat read accessnya
    const { role } = req.user;
    let roleArray = Array.isArray(role) ? role : [role]; // Ensure role is an array

    if (!roleArray)
      return response(res, 401, false, "you're not authorized!", null);

    let roleDB = await Role.findAll({
      where: { id: { [Op.in]: roleArray } },
      attributes: ["name"],
    });

    const userRole = roleDB
      .map((item) => item.name)
      .filter((item) => item === roleName);

    if (!userRole.length)
      return response(res, 401, false, "you're not authorized!", null);

    const module = await Module.findOne({ where: { name: moduleName } });
    if (!module) return response(res, 401, false, "you're not authorized!");

    let access = null;

    for (const role_name of userRole) {
      roleDB = await Role.findOne({ where: { name: role_name } });
      if (!roleDB) continue;
      access = await Access.findOne({
        where: { role_id: roleDB.id, module_id: module.id },
      });
      if (access) break;
    }

    //const access = await Access.findOne({
    //  where: { role_id: roleDB.id, module_id: module.id },
    //});

    if (!access) return response(res, 401, false, "you're not authorized!");

    if (readAccess && !access.read) {
      return response(res, 401, false, "you're not authorized");
    }

    if (writeAccess && !access.write) {
      return response(res, 401, false, "you're not authorized");
    }

    next();
  };
};

module.exports = rbac;
