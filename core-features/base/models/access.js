const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    modelId:{type:mongoose.Schema.Types.ObjectId, ref: 'Model',required:true},
    readPermission:{
        type:'Boolean',
        default:false
    },
    writePermission:{
        type:'Boolean',
        default:false
    },
    updatePermission:{
        type:'Boolean',
        default:false
    },
    deletePermission:{
        type:'Boolean',
        default:false
    },
})
schema.index({ role: 1, modelId: 1}, { unique: true });

schema.pre(/^find/, function (next) {
    this.populate({
      path: "modelId",
      select:"-_id"
    });
    next();
  });

const Access = mongoose.model('Access', schema);
module.exports = Access
