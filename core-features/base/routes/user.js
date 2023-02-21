const express = require("express")
const catchAsync = require("./catchAsync");
const router = express.Router()
const env = require("../../../core/environment")
//get all users
router.get("/users",catchAsync(async (req,res) => {
    const users = await env.UserModel.find();
    res.json(users)
}))


//create one users
router.post("/users",catchAsync(async (req,res) => {
    const newUser = await env.UserModel.create(req.body);
    res.json(newUser)
}))

module.exports = router

