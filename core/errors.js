const logger = require('./logger')

class AccessDenied extends Error{
    constructor(message){
        super(message)
        this.code = 401
        this.message = message || "Access denied"
    }
}

class NotFoundError extends Error{
    constructor(message){
        super(message)
        this.code = 404
        this.message = message || "Not found Error"
    }
}

class ConflictError extends Error{
    constructor(message){
        super(message)
        this.code = 409
        this.message = message || "Already exists"
    }
}

function handleError(err,req,res,next){
    if(err.code == 409)
        return res.status(400).json({
            "message":err.message
        })
    if(err.code == 401)
        return res.status(401).json({
            "message":err.message
        })
    logger.error(err)
    return res.status(500).json({
        "message":err.message
    })
}

module.exports = { AccessDenied,handleError,NotFoundError,ConflictError }