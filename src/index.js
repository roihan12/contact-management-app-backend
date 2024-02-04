import express from "express";
import "dotenv/config"
import appMiddleware from "./middlewares/index.js";

const HOST = process.env.HOST || "http://localhost";
const PORT = parseInt(process.env.PORT || "5000");

const app = express();

app.use(appMiddleware);



app.listen(PORT, async () => {
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
