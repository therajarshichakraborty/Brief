import type { Article } from "@news-aggrigator/contracts";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { articles, bookmarks } from "../../db/schema";
import { HttpError } from "../../lib/http-error";
import { articleColumns, toArticleDto } from "../news/news.service";

export async function listBookmarks(userId: string): Promise<Article[]> {
  const rows = await db
    .select(articleColumns)
    .from(bookmarks)
    .innerJoin(articles, eq(articles.id, bookmarks.articleId))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt));

  return rows.map(toArticleDto);
}

export async function addBookmark(userId: string, articleId: string): Promise<void> {
  const [article] = await db.select({ id: articles.id }).from(articles).where(eq(articles.id, articleId)).limit(1);
  if (!article) throw HttpError.notFound("Article not found");

  await db.insert(bookmarks).values({ userId, articleId }).onConflictDoNothing();
}

export async function removeBookmark(userId: string, articleId: string): Promise<void> {
  await db.delete(bookmarks).where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)));
}
