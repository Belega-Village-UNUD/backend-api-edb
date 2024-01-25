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
    //let roleDB = await Role.findOne({ where: { id:  } });

    let roleDB = await Role.findAll({
      where: { id: { [Op.in]: roleArray } },
      attributes: ["name"],
    });
    roleDB.forEach(({ name }) => {
      console.log("🚀 ~ roleDB.forEach ~ name:", name);
    });

    if (!roleDB) return response(res, 401, false, "you're not authorized!");

    if (roleDB.name !== roleName)
      return response(res, 401, false, "you're not authorized!");

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

    if (readAccess && !access.read) {
      return response(res, 401, false, "you're not authorized");
    }

    if (writeAccess && !access.write) {
      return response(res, 401, false, "you're not authorized");
    }

    next();
  };
  console.log("🚀 ~ return ~ roleDB:", roleDB);
};

module.exports = rbac;
