/**
 * Logger
 */
import * as winston from "winston";

export const logger: winston.LoggerInstance = new winston.Logger({
  level: process.env.LOG_LEVEL,
  transports: [
    new winston.transports.File({ filename: process.env.LOG_FILE }),
    new winston.transports.Console()
  ]
});
