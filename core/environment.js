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
            logger.info(`loaded ${routes.stack.length} routes ${Object.keys(models).length} models for '${path.split('/').pop()}' feature`)
            //loads data
            const data = json.data || []
            for(const md of data)
                await this.loadData(`${path}/${md}`)
            logger.info(`loaded ${data.length} data file for '${path.split('/').pop()}' feature`)
        }catch(err){
            if(err.code !== 'ENOENT'){
                logger.error("cannot load features",err)
                process.exit(1);
            }
            logger.warn(`manifest file dosen't exists ${feature}`);
        }
    }

    async loadData(path){
        const js = require(path);
        let data;
        if(typeof js === 'function')
            data = await js();
        else
            data = js
        const { model,jsId } = data;
        delete data.jsId,
        delete data.model;        
        const alreadyExists = await findDataById({jsId:jsId});
        if (alreadyExists){
            const existing = await this[model].findOne({_id:alreadyExists.id});
            await existing.update(data)
        }else{
            const newRecord = await this[model].create(data);
            await createData({
                jsId:jsId,
                id:newRecord._id
            })
        }
    }
    async _loadModels(path){
        const models = require(`${path}/models`);
        for(const [name,model] of Object.entries(models)){
            const existingModel = await findOneModel({name:model.modelName});
            if(existingModel)
                await existingModel.update({name:model.modelName,schema:model.schema.obj})
            else
                await createModel({name:model.modelName,schema:model.schema.obj});
            this[name] = new Repository(model);   
        }
        return models
    }

    _loadRoutes(path){
        //TODO:generate swagger docs
        const routes = require(`${path}/routes`);
        this.router.use(routes);
        return routes
    }

    connectDb(){
        connect();
    }
}

const env = new Environment(config.features);
env.loadFeatures();
module.exports = env