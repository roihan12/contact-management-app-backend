import express from "express";
import {
  register,
  activationAccount,
  login,
} from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/activation/:id", activationAccount);

export default authRoutes;
