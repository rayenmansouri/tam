const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    jsId:{
        type:'String',
        required:true,
        unique:true
    },
    id:{
        type:mongoose.Schema.ObjectId,
        unique:true,
        required:true
    }
})

module.exports = mongoose.model('Data',schema)