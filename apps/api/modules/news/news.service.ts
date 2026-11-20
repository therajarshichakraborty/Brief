import type { Article, ArticlePage, TopStories } from "@news-aggrigator/contracts";
import { and, asc, desc, eq, ilike, isNotNull, lt, or, type SQL } from "drizzle-orm";
import { db } from "../../db/client";
import { articles, bookmarks, topStories } from "../../db/schema";
import { HttpError } from "../../lib/http-error";
import type { ListArticlesQuery } from "./news.schemas";

interface Cursor {
  publishedAt: Date;
  id: string;
}

export const articleColumns = {
  id: articles.id,
  title: articles.title,
  summary: articles.summary,
  url: articles.url,
  source: articles.source,
  category: articles.category,
  imageUrl: articles.imageUrl,
  readingMinutes: articles.readingMinutes,
  publishedAt: articles.publishedAt,
  bookmarked: isNotNull(bookmarks.userId).mapWith(Boolean),
};

type ArticleRecord = Omit<Article, "publishedAt"> & { publishedAt: Date };

export function toArticleDto({ publishedAt, ...article }: ArticleRecord): Article {
  return { ...article, publishedAt: publishedAt.toISOString() };
}

export function bookmarkJoin(userId: string): SQL | undefined {
  return and(eq(bookmarks.articleId, articles.id), eq(bookmarks.userId, userId));
}

function encodeCursor({ publishedAt, id }: Cursor): string {
  return Buffer.from(`${publishedAt.toISOString()}|${id}`).toString("base64url");
}

function decodeCursor(value: string): Cursor {
  const [iso, id] = Buffer.from(value, "base64url").toString("utf8").split("|");
  const publishedAt = new Date(iso ?? "");
  if (!id || Number.isNaN(publishedAt.getTime())) throw HttpError.badRequest("Invalid cursor");
  return { publishedAt, id };
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}

export async function listArticles(userId: string, query: ListArticlesQuery): Promise<ArticlePage> {
  const filters: (SQL | undefined)[] = [];

  if (query.category) filters.push(eq(articles.category, query.category));

  if (query.q) {
    const pattern = `%${escapeLike(query.q)}%`;
    filters.push(or(ilike(articles.title, pattern), ilike(articles.summary, pattern)));
  }

  if (query.cursor) {
    const cursor = decodeCursor(query.cursor);
    filters.push(
      or(
        lt(articles.publishedAt, cursor.publishedAt),
        and(eq(articles.publishedAt, cursor.publishedAt), lt(articles.id, cursor.id)),
      ),
    );
  }

  const rows = await db
    .select(articleColumns)
    .from(articles)
    .leftJoin(bookmarks, bookmarkJoin(userId))
    .where(and(...filters))
    .orderBy(desc(articles.publishedAt), desc(articles.id))
    .limit(query.limit + 1);

  const page = rows.slice(0, query.limit);
  const last = page.at(-1);

  return {
    items: page.map(toArticleDto),
    nextCursor: rows.length > query.limit && last ? encodeCursor(last) : null,
  };
}

export async function getArticle(userId: string, id: string): Promise<Article> {
  const [row] = await db
    .select(articleColumns)
    .from(articles)
    .leftJoin(bookmarks, bookmarkJoin(userId))
    .where(eq(articles.id, id))
    .limit(1);

  if (!row) throw HttpError.notFound("Article not found");
  return toArticleDto(row);
}

export async function getTopStories(userId: string, limit: number): Promise<TopStories> {
  const rows = await db
    .select({
      ...articleColumns,
      rank: topStories.rank,
      coverage: topStories.coverage,
      computedAt: topStories.computedAt,
    })
    .from(topStories)
    .innerJoin(articles, eq(articles.id, topStories.articleId))
    .leftJoin(bookmarks, bookmarkJoin(userId))
    .orderBy(asc(topStories.rank))
    .limit(limit);

  return {
    computedAt: rows[0]?.computedAt.toISOString() ?? null,
    items: rows.map(({ computedAt: _computedAt, rank, coverage, ...article }) => ({
      ...toArticleDto(article),
      rank,
      coverage,
    })),
  };
}
