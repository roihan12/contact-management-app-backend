import express from "express";
import { authentication } from "../controllers/errorHandlingController.js";
import {
  updateUser,
  deleteUser,
  getUser,
  forgotPassword
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.patch("/:id", authentication, updateUser);
userRoutes.delete("/:id", authentication, deleteUser);
userRoutes.get("/:id", authentication, getUser);
userRoutes.post("/forgot-password", forgotPassword);


export default userRoutes;
