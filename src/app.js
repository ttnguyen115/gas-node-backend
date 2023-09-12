require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// init middlewares ----------------------------------------------------------------------------------------------------
// DEV env
app.use(morgan("dev"));
// PROD env
// app.use(morgan("combined"))
// Protect metadata header information including tech stacks, ...
app.use(helmet());
// Optimize the response capacity
app.use(compression());

// init db -------------------------------------------------------------------------------------------------------------
require("./database/init.mongodb");

// init routes ---------------------------------------------------------------------------------------------------------
app.use("/", require("./routes"));

// handling error

module.exports = app;
