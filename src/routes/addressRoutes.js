import express from "express";
import { authentication } from "../controllers/errorHandlingController.js";
import { createAddress, getAddress, getAddressById, updateAddress, deleteAddress} from "../controllers/addressController.js";

const addressRoutes = express.Router();

addressRoutes.post("/:id", authentication, createAddress);
addressRoutes.get("/", authentication, getAddress);
addressRoutes.get("/:id", authentication, getAddressById);
addressRoutes.put("/:id", authentication, updateAddress);
addressRoutes.delete("/:id", authentication, deleteAddress);

export default addressRoutes;
