import { Router } from "express";
import { z } from "zod";
import { addBookmark, listBookmarks, removeBookmark } from "./bookmarks.service";

const bookmarkParamsSchema = z.object({
  articleId: z.uuid(),
});

export const bookmarksRouter = Router();

bookmarksRouter.get("/", async (_req, res) => {
  res.json({ items: await listBookmarks(res.locals.user.id) });
});

bookmarksRouter.put("/:articleId", async (req, res) => {
  const { articleId } = bookmarkParamsSchema.parse(req.params);
  await addBookmark(res.locals.user.id, articleId);
  res.status(204).end();
});

bookmarksRouter.delete("/:articleId", async (req, res) => {
  const { articleId } = bookmarkParamsSchema.parse(req.params);
  await removeBookmark(res.locals.user.id, articleId);
  res.status(204).end();
});
