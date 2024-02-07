import logger from "../middlewares/winston.js";

const errorHandling = (err, req, res, next) => {
  const message = err.message.split(" - ")[1];
  logger.error(err);
  res.status(500).json({
    errors: [message],
    message: "Internal Server Error",
    data: null,
  });
};

export { errorHandling };
