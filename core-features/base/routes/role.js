const express = require("express")
const catchAsync = require("./catchAsync");
const router = express.Router()
const env = require("../../../core/environment")
const { NotFoundError } = require("../../../core/errors")


async function mustExists(access = []){
    for(const id of access){
        exists = await env.AccessModel.findOne({_id:id});
        if (!exists)
            throw new NotFoundError("access not found");
    }
}
//get all users
router.get("/roles",catchAsync(async (req,res) => {
    const users = await env.RoleModel.find();
    res.json(users)
}))


//create one users
router.post("/roles",catchAsync(async (req,res) => {
    const { access } = req.body;
    await mustExists(access);
    const newUser = await env.RoleModel.create(req.body);
    res.json(newUser)
}))

module.exports = router