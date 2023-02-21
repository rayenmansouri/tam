const config = require("config");
const mongoose = require("mongoose");
const logger = require("../logger")

module.exports = (dbname = config.defaultDb) => {
    mongoose.connect(`${config.dbUri}/${dbname}`).then(() => {
         logger.info(`connected to database '${dbname}'`)
    }).catch(err => {
        logger.error("cannot connect to database",err)
        process.exit(1);
    })  
}
