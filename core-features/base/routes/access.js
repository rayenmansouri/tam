const express = require("express")
const catchAsync = require("./catchAsync");
const router = express.Router()
const env = require("../../../core/environment")
//get all users
router.get("/access",catchAsync(async (req,res) => {
    const users = await env.AccessModel.find();
    res.json(users)
}))


//create one users
router.post("/access",catchAsync(async (req,res) => {
    const newUser = await env.AccessModel.create(req.body);
    res.json(newUser)
}))

module.exports = router