import express from "express";
import swaggerUi from "swagger-ui-express";
import { apiDocumentation } from "../../docs/apidoc.js";
import usersRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import contactsRoutes from "./contactRoutes.js";
import { errorHandling } from "../controllers/errorHandlingController.js";

const route = express.Router();

route.use("/api/auth", authRoutes);
route.use("/api/users", usersRoutes);
route.use("/api/contacts", contactsRoutes);

route.use("/documentation", swaggerUi.serve, swaggerUi.setup(apiDocumentation));
route.use("*", errorHandling);
route.use("*", (req, res) => {
  res.status(404).json({
    errors: ["Page Not Found"],
    message: "Internal Server Error",
    data: null,
  });
});

export default route;
