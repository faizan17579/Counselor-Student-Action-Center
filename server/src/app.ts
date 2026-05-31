import cors from "cors";
import express from "express";
import actionCenterRoutes from "./routes/actionCenterRoutes";
import { requestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // request id must come before logging so token is available
  app.use(requestId);

  // add a small token for morgan to read request id
  // morgan custom token registration
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const morgan = require("morgan");
  morgan.token("reqId", (req: any) => req.id || req.headers["x-request-id"] || "-");
  app.use(requestLogger as any);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(actionCenterRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: { message: "Route not found." } });
  });

  // error handler should come last
  app.use(errorHandler as any);

  return app;
}
