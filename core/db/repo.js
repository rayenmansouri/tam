/*Environment is main api to system*/

const { Model,AccessModel } = require("../../core-features/base/models"); //hardcoded registry
const { AccessDenied } = require("../errors");


class Repository{
    constructor(model){
        this.model = model;
        this.name = model.modelName;
        this.userId = null;
    }

    async find(query){
        this.userId !== null && this.checkPermission('readPermission')
        return await this.model.find(query)
    }
    async findOne(query){
        this.userId !== null && this.checkPermission('readPermission')
        return await this.model.findOne(query)
    }
    async create(body){
        this.userId !== null && this.checkPermission('writePermission')
        return await this.model.create(body)
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

module.exports = Repository;