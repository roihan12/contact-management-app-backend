import express from 'express';
import { register,activationAccount } from '../controllers/authController.js';

const authRoutes = express.Router();

authRoutes.post("/register", register)
authRoutes.get("/activation/:id", activationAccount)

export default authRoutes