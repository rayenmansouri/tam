const express = require("express")

const router = express.Router();

router.get("/tasks",(req,res) => {
    res.json(["task1","task2"])
})

module.exports = router