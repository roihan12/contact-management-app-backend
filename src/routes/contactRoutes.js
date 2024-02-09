import express from "express";
import { authentication } from "../controllers/errorHandlingController.js";
import { createContact } from "../controllers/contactController.js";

const contactRoutes = express.Router();
contactRoutes.post("/", authentication, createContact)

export default contactRoutes;
