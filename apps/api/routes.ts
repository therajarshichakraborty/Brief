import { Router } from "express";
import { requireSession } from "./middleware/require-session";
import { bookmarksRouter } from "./modules/bookmarks/bookmarks.router";
import { newsRouter } from "./modules/news/news.router";
import { syncRouter } from "./modules/sync/sync.router";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use(requireSession);
apiRouter.use("/news", newsRouter);
apiRouter.use("/bookmarks", bookmarksRouter);
apiRouter.use("/sync", syncRouter);
