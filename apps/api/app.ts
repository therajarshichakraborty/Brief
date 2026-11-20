import { env } from "@news-aggrigator/env";
import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { auth } from "./auth/auth";
import { logger } from "./lib/logger";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { apiRouter } from "./routes";

export function scaffoldApplication(): Express {
  const app: Express = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === "/api/health" } }));

  app.all("/api/auth/*splat", toNodeHandler(auth));

  app.use(express.json({ limit: "50kb" }));
  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
