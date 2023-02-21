const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name:{
        type:'String',
        required:true
    },
    
    access:{
        type:[{type:mongoose.Schema.Types.ObjectId, ref: 'Access'}],
        required:true,
        validate:[minLength(1),'path access must have at least one record']
    }
})

function minLength(min){
    return (val) => {
        return val.length >= min;
    }
}

  
module.exports = mongoose.model("Role",schema)