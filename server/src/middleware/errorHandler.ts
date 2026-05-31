import { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.id ?? req.headers["x-request-id"] ?? "unknown";
  // minimal structured logging
  // eslint-disable-next-line no-console
  console.error(JSON.stringify({ level: "error", requestId, error: String(err) }));

  res.status(500).json({ error: { message: "Internal server error.", requestId } });
}
