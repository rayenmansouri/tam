/*Environment is the main interface to the system
  provide a repository and features management
*/

const connect = require("./db/connect");
const { Repository,
        createFeature,findOneFeature,
        findOneModel,createModel,
        findDataById,createData
      } = require("./db/repo")
const logger = require("./logger")
const fs = require("fs")
const config = require("config");
const express = require("express");

class Environment{
    constructor(dirs){
        //a simple singelton
        if(Environment.instance == null){
            this.connectDb()
            this.router = express.Router();
            this.dirs = dirs
            Environment.instance = this;
        }
        return Environment.instance
    }

    loadFeatures(){
        const dirs = this.dirs;
        logger.info(`dirs: ${dirs}`);
        dirs.forEach(dir => {
            const features = fs.readdirSync(dir);
            features.forEach(feature => this.loadFeature(`${dir}/${feature}`))
        })
    }

    async loadFeature(path){
        try{
            const manifest = fs.readFileSync(`${path}/manifest.json`);
            const json = JSON.parse(manifest);
            const existingFeature = await findOneFeature({path});
            if(existingFeature){
                await existingFeature.update(json)
            }else
                await createFeature({...json,path});
            //install models routes then load data (order matter)
            const models = await this._loadModels(path);
            const routes = await this._loadRoutes(path);
            logger.info(`loaded ${routes} routes ${models} models for '${path.split('/').pop()}' feature`)
            //loads data
            const data = json.data || []
            for(const md of data)
                await this.loadData(`${path}/${md}`)
            logger.info(`loaded ${data.length} data file for '${path.split('/').pop()}' feature`)
        }catch(err){
            if(err.code != 'ENONET'){
                logger.error("cannot load features",err)
                process.exit(1);
            }
        }
    }
    
    async parseBody(body){
        for(const [key,value] of Object.entries(body)){
            if(typeof value === 'object')
                body[key] = await this.parseBody(value);
        }
        switch(body.type){
            case "ref":
                const exists = await findDataById({jsId:body.id});
                return exists.id;
            default:
                return body
        }
    }

    async loadData(path){
        const json = require(path);
        const { model,id,body } = json;
        const alreadyExists = await findDataById({jsId:id});
        if (alreadyExists){
            const existing = await this[model].findOne({_id:alreadyExists.id});
            await existing.update(await this.parseBody(body))
        }else{
            const newRecord = await this[model].create(await this.parseBody(body));
            await createData({
                jsId:id,
                id:newRecord._id
            })
        }
    }

    async _loadModels(path){
        let models;
        try{
            models = require(`${path}/models`);
        }catch(e){
            return 0;
        }
        for(const model of Object.values(models)){
            const existingModel = await findOneModel({name:model.modelName});
            if(existingModel)
                await existingModel.update({name:model.modelName,schema:model.schema.obj})
            else{
                const newModel = await createModel({name:model.modelName,schema:model.schema.obj});
                await createData({
                    jsId:model.modelName,
                    id:newModel._id
                })
            }
            this[model.modelName] = new Repository(model);   
        }
        return Object.keys(models).length
    }

    _loadRoutes(path){
        //TODO:generate swagger docs
        try{
            const routes = require(`${path}/routes`);
            this.router.use(routes);
            return routes.stack.length
        }catch(err){
            return 0
        }
    }

    connectDb(){
        connect();
    }
}

const env = new Environment(config.features);
env.loadFeatures();
module.exports = env