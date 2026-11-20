import type { LatestSync, SyncRun } from "@news-aggrigator/contracts";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { getLatestSync, startSync, toSyncRunDto } from "./sync.service";

const manualSyncLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (_req, res) => res.locals.user.id,
  message: { error: "Too many sync requests, please try again later" },
});

export const syncRouter = Router();

syncRouter.get("/latest", async (_req, res) => {
  const run = await getLatestSync();
  const body: LatestSync = { run: run ? toSyncRunDto(run) : null };
  res.json(body);
});

syncRouter.post("/", manualSyncLimiter, async (_req, res) => {
  const run = await startSync("manual");
  const body: SyncRun = toSyncRunDto(run);
  res.status(202).json(body);
});
