const express = require("express")
const catchAsync = require("./catchAsync");
const router = express.Router()
const env = require("../../../core/environment")
const { NotFoundError } = require("../../../core/errors")



//get all users
router.get("/roles",catchAsync(async (req,res) => {
    const users = await env.Role.find();
    res.json(users)
}))


//create one users
router.post("/roles",catchAsync(async (req,res) => {
    const newUser = await env.Role.create(req.body);
    res.json(newUser)
}))

module.exports = router