import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export const requestId: RequestHandler = (req, _res, next) => {
  const id = uuidv4();
  req.id = id;
  // attach to headers for downstream logging
  req.headers["x-request-id"] = id;
  next();
};
