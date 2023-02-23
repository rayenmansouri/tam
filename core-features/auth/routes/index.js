const express = require("express");
const router = express.Router();


router.use("/login",(req,res) => {
    res.json({
        message:"welcome !"
    })
})

module.exports = router