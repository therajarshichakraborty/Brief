import "./config/load-env";
import { createServer, type Server } from "node:http";
import { env } from "@news-aggrigator/env";
import { scaffoldApplication } from "./app";
import { pool } from "./db/client";
import { startSyncScheduler } from "./jobs/sync-scheduler";
import { logger } from "./lib/logger";
import { failInterruptedRuns, syncIfStale } from "./modules/sync/sync.service";

const SHUTDOWN_TIMEOUT_MS = 10_000;

async function bootStrapServer(): Promise<Server> {
  await failInterruptedRuns();

  const server: Server = createServer(scaffoldApplication());
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(env.PORT, resolve);
  });
  logger.info(`API listening on http://localhost:${env.PORT}`);

  const scheduler = startSyncScheduler();
  void syncIfStale().catch((error: unknown) => logger.error({ err: error }, "Initial sync failed to start"));

  const shutdown = (signal: NodeJS.Signals) => {
    logger.info({ signal }, "Shutting down");
    scheduler.stop();
    setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS).unref();
    server.close(() => {
      void pool.end().finally(() => process.exit(0));
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  return server;
}

bootStrapServer().catch((error: unknown) => {
  logger.fatal({ err: error }, "Server failed to start");
  process.exit(1);
});
