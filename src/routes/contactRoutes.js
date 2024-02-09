import express from "express";
import { authentication } from "../controllers/errorHandlingController.js";
import { createContact, getContact } from "../controllers/contactController.js";

const contactRoutes = express.Router();
contactRoutes.post("/", authentication, createContact);
contactRoutes.get("/", authentication, getContact);

export default contactRoutes;
