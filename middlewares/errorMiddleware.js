import { DEV_MODE } from "../config/constants.js";
import { AppError } from "../utils/appError.js";

export const errorHandler = (err, req, res, next) => {
  let message = err.message;
  if(!(err instanceof AppError)) {
    console.log(err);
    message = "Something Unexpected Happended Internally!!"
  }
  if(DEV_MODE) console.log(err);
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({
    message: message
  });
};
