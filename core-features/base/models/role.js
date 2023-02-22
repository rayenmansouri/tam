const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name:{
        type:'String',
        required:true,
        unique:true
    }
})

module.exports = mongoose.model("Role",schema)