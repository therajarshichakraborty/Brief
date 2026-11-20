import { Router } from "express";
import { articleParamsSchema, listArticlesQuerySchema, topStoriesQuerySchema } from "./news.schemas";
import { getArticle, getTopStories, listArticles } from "./news.service";

export const newsRouter = Router();

newsRouter.get("/", async (req, res) => {
  const query = listArticlesQuerySchema.parse(req.query);
  res.json(await listArticles(res.locals.user.id, query));
});

newsRouter.get("/top", async (req, res) => {
  const { limit } = topStoriesQuerySchema.parse(req.query);
  res.json(await getTopStories(res.locals.user.id, limit));
});

newsRouter.get("/:id", async (req, res) => {
  const { id } = articleParamsSchema.parse(req.params);
  res.json(await getArticle(res.locals.user.id, id));
});
