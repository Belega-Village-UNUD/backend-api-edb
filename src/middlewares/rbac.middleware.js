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
    if (!role) return response(res, 401, false, "you're not authorized!", null);

    let roleDB = await Role.findOne({ where: { id: { [Op.in]: role } } });

    if (!roleDB) return response(res, 401, false, "you're not authorized!");

    const module = await Module.findOne({ where: { name: moduleName } });
    if (!module) return response(res, 401, false, "you're not authorized!");

    let access = null;

    for (const role_id of role) {
      roleDB = await Role.findOne({ where: { id: role_id } });
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

    console.log("rbac read :", readAccess);
    console.log("user read :", access.read);

    console.log("rbac write :", writeAccess);
    console.log("user write :", access.write);

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
