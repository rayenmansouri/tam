const express = require("express");
const { handleError } = require("./core/errors")
const { NotFoundError } = require("./core/errors")

const env = require("./core/environment")

app = express()
app.use(express.json());
app.use(env.router);
app.all("*",(req,res,next) => {
    next(new NotFoundError("route not found"))
})
app.use(handleError);
app.listen(8000)



