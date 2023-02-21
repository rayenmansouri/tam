/*Environment is the main interface to the system*/

const models = require("../core-features/base/models");
const connect = require("./db/connect");
const Repository = require("./db/repo")
const logger = require("./logger")
const fs = require("fs")
const config = require("config");
const express = require("express")

class Environment{
    constructor(){
        if(Environment.instance == null){
            this._dbConnect()
            this.router = express.Router();
            this._init();

            Environment.instance = this;
        }
        return Environment.instance
    }

    _init(){
        const dirs = config.features;
        logger.info(`dirs: ${dirs}`);
        dirs.forEach(dir => {
            const features = fs.readdirSync(dir);
            features.forEach(feature => {
                try{
                    this._loadManifest(`${dir}/${feature}`);
                }catch(err){
                    if(err.code !== 'ENOENT'){
                        logger.error("cannot read manifest file")
                        console.log(err)
                        process.exit(1);
                    }
                    logger.warn(`manifest file dosen't exists ${feature}`);
                }
            })
        })
        
    }
    _loadManifest(path){
        const manifest = fs.readFileSync(`${path}/manifest.json`);
        const json = JSON.parse(manifest);
        models.Feature.create({...json,path}).then(() => {
            logger.info(`loaded manifest for ${json.name}`)
        }).catch(err => {
            if(err.code !== 11000){
                logger.error(`cannot load manifest for feature ${json.name}`)
                process.exit(1);
            }
            models.Feature.findOne({name:json.name}).update(json).then(() => {
                logger.info(`loaded manifest for ${json.name}`)
            })
        }).finally(() => {
            if(json.installed)
                this._install(path)
        })
    }
    _install(path){
        const models = require(`${path}/models`);
        const routes = require(`${path}/routes`)
        for(const [name,model] of Object.entries(models)){
            this._loadSchema(model.modelName,model.schema);
            this[name] = new Repository(model);    
        }
        logger.info(`installed routes`)
        this.router.use(routes)
    }

    _loadSchema(name,schema){
        models.Model.create({
            name:name,
            schema:schema.obj
        }).then(() => {
            logger.info(`\tinitialized model: ${name}`)
        }).catch(e => {
            if(e.code != 11000){
                logger.error("cannot initialize model")
                process.exit(1);
            }
            models.Model.findOne({name:name}).then(model => { 
                model.update({schema:schema.obj}).then(() => {
                    logger.info(`initialized model: ${name}`);
                })
            })
        })
    }
    _dbConnect(){
        connect();
    }
}

const env = new Environment()
module.exports = env