const Model = require("../models/model");
const RoleModel = require("../models/role")

module.exports = async () => {
    const role = await RoleModel.findOne({name:"admin"});
    const modelId = await Model.findOne({name:"Access"});
     return {
        model:"AccessModel",
        jsId:"accessModelAccess",
        role:role._id,
        modelId:modelId._id,
        writePermission:true,
        readPermission:true,
        updatePermission:true,
        deletePermission:true
     }
}
