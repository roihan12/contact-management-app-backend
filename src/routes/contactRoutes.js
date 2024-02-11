import express from "express";
import { authentication } from "../controllers/errorHandlingController.js";
import { createContact, getContact, getContactById, updateContact, deleteContact} from "../controllers/contactController.js";

const contactRoutes = express.Router();
contactRoutes.post("/", authentication, createContact);
contactRoutes.get("/", authentication, getContact);
contactRoutes.get("/:id", authentication, getContactById);
contactRoutes.put("/:id", authentication, updateContact);
contactRoutes.delete("/:id", authentication, deleteContact);

export default contactRoutes;
