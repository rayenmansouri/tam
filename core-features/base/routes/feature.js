const express = require("express");
const router = express.Router()
const catchAsync = require("./catchAsync")
const env = require("../../../core/environment");

router.get("/features",catchAsync(async (req,res) => {
    const features = await env.Feature.find({});
    res.json(features);
}))

module.exports = router