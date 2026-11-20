import type { SyncRun, SyncTrigger } from "@news-aggrigator/contracts";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { type SyncRunRow, syncRuns } from "../../db/schema";
import { runIngestion } from "../../ingestion/pipeline";
import { logger } from "../../lib/logger";

const STALE_AFTER_MS = 60 * 60 * 1000;

let activeRun: Promise<SyncRunRow> | null = null;

export function toSyncRunDto(row: SyncRunRow): SyncRun {
  return {
    id: row.id,
    trigger: row.trigger,
    status: row.status,
    articlesAdded: row.articlesAdded,
    startedAt: row.startedAt.toISOString(),
    finishedAt: row.finishedAt?.toISOString() ?? null,
  };
}

async function execute(run: SyncRunRow): Promise<void> {
  const log = logger.child({ syncRunId: run.id, trigger: run.trigger });
  log.info("Sync started");

  try {
    const result = await runIngestion();
    await db
      .update(syncRuns)
      .set({ status: "succeeded", articlesAdded: result.articlesAdded, finishedAt: new Date() })
      .where(eq(syncRuns.id, run.id));
    log.info(result, "Sync finished");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(syncRuns)
      .set({ status: "failed", error: message, finishedAt: new Date() })
      .where(eq(syncRuns.id, run.id));
    log.error({ err: error }, "Sync failed");
  }
}

async function launch(trigger: SyncTrigger): Promise<SyncRunRow> {
  const [run] = await db.insert(syncRuns).values({ trigger }).returning();
  if (!run) throw new Error("Failed to record sync run");

  void execute(run).finally(() => {
    activeRun = null;
  });
  return run;
}

export function startSync(trigger: SyncTrigger): Promise<SyncRunRow> {
  activeRun ??= launch(trigger).catch((error: unknown) => {
    activeRun = null;
    throw error;
  });
  return activeRun;
}

export async function getLatestSync(): Promise<SyncRunRow | null> {
  const [run] = await db.select().from(syncRuns).orderBy(desc(syncRuns.startedAt)).limit(1);
  return run ?? null;
}

export async function failInterruptedRuns(): Promise<void> {
  await db
    .update(syncRuns)
    .set({ status: "failed", error: "Interrupted by server shutdown", finishedAt: new Date() })
    .where(eq(syncRuns.status, "running"));
}

export async function syncIfStale(): Promise<void> {
  const [lastSuccess] = await db
    .select({ finishedAt: syncRuns.finishedAt })
    .from(syncRuns)
    .where(eq(syncRuns.status, "succeeded"))
    .orderBy(desc(syncRuns.startedAt))
    .limit(1);

  const finishedAt = lastSuccess?.finishedAt?.getTime() ?? 0;
  if (Date.now() - finishedAt > STALE_AFTER_MS) await startSync("scheduled");
}
