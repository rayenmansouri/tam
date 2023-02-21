const mongoose =  require("mongoose");

const schema = new mongoose.Schema({
    name:{
        type:'String',
        required:true
    },
    description:{
        type:'String',
        required:true
    }
})

const Task = mongoose.model('Task',schema);