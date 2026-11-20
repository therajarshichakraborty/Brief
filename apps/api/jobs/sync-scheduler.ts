import { env } from "@news-aggrigator/env";
import { Cron } from "croner";
import { logger } from "../lib/logger";
import { startSync } from "../modules/sync/sync.service";

export function startSyncScheduler(): Cron {
  const job = new Cron(
    env.SYNC_CRON,
    {
      name: "news-sync",
      protect: true,
      catch: (error) => logger.error({ err: error }, "Scheduled sync could not start"),
    },
    async () => {
      await startSync("scheduled");
    },
  );

  logger.info({ pattern: env.SYNC_CRON, nextRun: job.nextRun()?.toISOString() }, "Sync scheduler started");
  return job;
}
