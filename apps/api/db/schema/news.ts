import { CATEGORIES } from "@news-aggrigator/contracts";
import { index, integer, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const categoryEnum = pgEnum("category", CATEGORIES);

export const syncTriggerEnum = pgEnum("sync_trigger", ["manual", "scheduled"]);

export const syncStatusEnum = pgEnum("sync_status", ["running", "succeeded", "failed"]);

export const articles = pgTable(
  "articles",
  {
    id: uuid().primaryKey().defaultRandom(),
    url: text().notNull().unique(),
    title: text().notNull(),
    summary: text().notNull(),
    category: categoryEnum().notNull(),
    source: text().notNull(),
    imageUrl: text(),
    readingMinutes: integer().notNull().default(1),
    publishedAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("articles_published_at_idx").on(table.publishedAt.desc(), table.id.desc()),
    index("articles_category_published_at_idx").on(table.category, table.publishedAt.desc(), table.id.desc()),
  ],
);

export const topStories = pgTable("top_stories", {
  rank: integer().primaryKey(),
  articleId: uuid()
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  coverage: integer().notNull(),
  computedAt: timestamp({ withTimezone: true }).notNull(),
});

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    articleId: uuid()
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.articleId] }),
    index("bookmarks_article_id_idx").on(table.articleId),
  ],
);

export const syncRuns = pgTable(
  "sync_runs",
  {
    id: uuid().primaryKey().defaultRandom(),
    trigger: syncTriggerEnum().notNull(),
    status: syncStatusEnum().notNull().default("running"),
    articlesAdded: integer().notNull().default(0),
    error: text(),
    startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp({ withTimezone: true }),
  },
  (table) => [index("sync_runs_started_at_idx").on(table.startedAt.desc())],
);

export type ArticleRow = typeof articles.$inferSelect;

export type NewArticleRow = typeof articles.$inferInsert;

export type SyncRunRow = typeof syncRuns.$inferSelect;
