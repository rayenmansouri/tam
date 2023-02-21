const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name:{
        type:'String',
        required:true,
    },
    path:{
        type:'String',
        required:true,
        unique:true
    },
    description:{
        type:'String',
        required:true
    },
    installed:{
        type:'Boolean',
        default:false
    }
})

module.exports = mongoose.model("Feature",schema)