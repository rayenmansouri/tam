const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name:{
        type:'String',
        required:true  
    },
    email:{
        type:'String',
        unique:true,
        required:true  
    },
    role:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Role',
    },
    password:{
        type:String,
        required:true  
    },
})

const User = mongoose.model("User",schema);

module.exports = User