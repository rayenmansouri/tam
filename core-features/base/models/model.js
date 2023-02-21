const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    name:{
        unique:true,
        type:'String'
    },
    installed:{
        type:'Boolean',
        default:false
    },
    schema: {
        type: mongoose.Schema.Types.Mixed,
    }
})

module.exports = mongoose.model('Model',schema);