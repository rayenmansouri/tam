const express = require("express")
const catchAsync = require("./catchAsync");
const router = express.Router()
const env = require("../../../core/environment")
//get all users
router.get("/models",catchAsync(async (req,res) => {
    const users = await env.Model.find();
    console.log(users[1].field)
    res.json(users)
}))


//create one users
router.post("/models",catchAsync(async (req,res) => {
    const newUser = await env.Model.create(req.body);
    res.json(newUser)
}))

module.exports = router