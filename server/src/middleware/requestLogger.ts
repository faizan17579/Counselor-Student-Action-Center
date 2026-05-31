import morgan from "morgan";
import { RequestHandler } from "express";

export const requestLogger: RequestHandler = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms :reqId',
  {
    // custom token for request id is provided by requestId middleware
  },
);
