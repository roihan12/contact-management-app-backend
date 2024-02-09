import express from 'express';
import { authentication } from '../controllers/errorHandlingController.js';
import { updateUser } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.patch('/users/:id',authentication, updateUser )
export default userRoutes