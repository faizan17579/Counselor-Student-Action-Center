import cors from "cors";
import express from "express";
import actionCenterRoutes from "./routes/actionCenterRoutes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(actionCenterRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: { message: "Route not found." } });
  });

  return app;
}
