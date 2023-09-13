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

// handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.code = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
