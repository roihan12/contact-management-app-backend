import express from "express";
import route from "../routes/index.js";
import "./winston.js";
import cors from "cors";

const appMiddleware = express();

appMiddleware.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH",
  })
);
appMiddleware.options("*", cors());
appMiddleware.use(express.urlencoded({ extended: true, limit: "50mb" }));
appMiddleware.use(express.json());
appMiddleware.use(route);

export default appMiddleware;
