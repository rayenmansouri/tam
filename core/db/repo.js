/*Environment is main api to system*/

const { Model,AccessModel, Feature,Data } = require("../../core-features/base/models"); //hardcoded registry
const { AccessDenied,ConflictError, NotFoundError } = require("../errors");


class Repository{
    constructor(model){
        this.model = model;
        this.name = model.modelName;
        this.userId = null;
    }

    async find(query){
        this.userId !== null && this.checkPermission('readPermission');
        return await this.model.find(query)
    }
    async findOne(query){
        this.userId !== null && this.checkPermission('readPermission');
        return await this.model.findOne(query)
    }
    async create(body){
        this.userId !== null && this.checkPermission('writePermission');
        try{
            return await this.model.create(body)
        }catch(err){
            if(err.code == 11000){

                throw new ConflictError(err.message)
            }
            throw Error(err.message)
        }
    }
    async checkPermission(mode){
        const modelId = await Model.findOne({name:this.name});
        const access = await AccessModel.findOne({user:this.userId,modelId:modelId.id});
        if (!access || !access[mode]){
            throw new AccessDenied("you don't have permission !");
        }
        return true
    }
    withUser(uid){
        this.userId = uid;
    }
}

//builtins 
async function createFeature(newFeature){

    return await Feature.create(newFeature)
   
}

async function findOneFeature(query){
    return await Feature.findOne(query);
}

async function createModel(newModel){
    return await Model.create(newModel)
}

async function findOneModel(query){
    return await Model.findOne(query);
}

async function findDataById(query){
    return await Data.findOne(query)
}

async function createData(body){
    return await Data.create(body);
}

module.exports = { Repository,createFeature,findOneFeature,findOneModel,createModel,findDataById,createData };