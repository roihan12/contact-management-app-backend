import express from "express";
import { authentication } from "../controllers/errorHandlingController.js";
import {
  updateUser,
  deleteUser,
  getUser,
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.patch("/users/:id", authentication, updateUser);
userRoutes.delete("/users/:id", authentication, deleteUser);
userRoutes.get("/users/:id", authentication, getUser);


export default userRoutes;
