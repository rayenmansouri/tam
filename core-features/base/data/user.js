const RoleModel = require("../models/role")

module.exports = async () => {
    const role = await RoleModel.findOne({name:"admin"});
    return {
        model:"UserModel",
        name:"rayen mansouri",
        jsId:"rayen",
        role:role._id,
        email:"mansourirayen@takiacademyteam.com",
        password:"123"
    }
}
