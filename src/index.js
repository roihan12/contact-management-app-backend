import express from "express";
import swaggerUi from "swagger-ui-express";

import { apiDocumentation } from "../docs/apidoc.js";

const HOST = process.env.HOST || "http://localhost";
const PORT = parseInt(process.env.PORT || "4500");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/documentation", swaggerUi.serve, swaggerUi.setup(apiDocumentation));

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.listen(PORT, async () => {
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
