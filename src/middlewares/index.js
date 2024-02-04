import express from "express";
import route from "../routes/index.js";

const appMiddleware = express();

appMiddleware.use(express.urlencoded({ extended: true , limit:"50mb"}));
appMiddleware.use(express.json());
appMiddleware.use(route);

export default appMiddleware;
