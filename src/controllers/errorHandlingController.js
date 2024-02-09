import logger from "../middlewares/winston.js";
import { verifyAccessToken } from "../utils/jwt.js";

const errorHandling = (err, req, res, next) => {
  const message = err.message.split(" - ")[1];
  logger.error(err);
  res.status(500).json({
    errors: [message],
    message: "Internal Server Error",
    data: null,
  });
};

const authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      errors: ["Token not found"],
      message: "Verify token failed",
      data: null,
    });
  }

  const user = verifyAccessToken(token);

  if (!user) {
    return res.status(401).json({
      errors: ["Invalid token"],
      message: "Verify token failed",
      data: null,
    });
  }

  req.user = user;
  next();
};

export { errorHandling, authentication };
