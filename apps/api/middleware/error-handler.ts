import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError, z } from "zod";
import { HttpError } from "../lib/http-error";
import { logger } from "../lib/logger";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Not found" });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: "Invalid request", details: z.flattenError(error).fieldErrors });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  logger.error({ err: error, method: req.method, path: req.path }, "Unhandled request error");
  res.status(500).json({ error: "Internal server error" });
};
