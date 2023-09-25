require("dotenv").config();
import ErrorRequest from "./core/errorRequest";
import { type Express } from "express-serve-static-core";
import express, {
  json,
  type NextFunction,
  type Request,
  type Response,
  urlencoded,
} from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
// init db
import "./database/init.mongodb";

const app: Express = express();

app.use(json());
app.use(
  urlencoded({
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

// init routes ---------------------------------------------------------------------------------------------------------
app.use("/", require("./routes"));

// handle errors
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorRequest("Not Found", 404);
  next(error);
});

app.use(
  (error: ErrorRequest, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = error.status || 500;
    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      stack: error.stack,
      message: error.message || "Internal Server Error",
    });
  },
);

export default app;
