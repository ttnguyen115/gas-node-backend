const express = require('express')
const morgan = require("morgan")
const helmet = require("helmet");
const compression = require("compression");
const app = express()

// init middlewares ----------------------------------------------------------------------------------------------------
// DEV env
app.use(morgan("dev"))
// PROD env
// app.use(morgan("combined"))
// Protect metadata header information including tech stacks, ...
app.use(helmet())
// Optimize the response capacity
app.use(compression())

// init db -------------------------------------------------------------------------------------------------------------

// init routes ---------------------------------------------------------------------------------------------------------
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Welcome to my world!"
    })
})

// handling error

module.exports = app