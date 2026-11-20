import { and, eq, gte, inArray, lt, notExists } from "drizzle-orm";
import pLimit from "p-limit";
import { db } from "../db/client";
import { articles, bookmarks, type NewArticleRow, topStories } from "../db/schema";
import { logger } from "../lib/logger";
import { type ExtractedArticle, extractArticle } from "./article-extractor";
import { type FeedEntry, readFeed } from "./feed-reader";
import { NEWS_SOURCES, type NewsSource } from "./sources";
import { rankStories } from "./story-ranking";
import { summarize } from "./summarizer";
import { countWords } from "./text";

interface Candidate extends FeedEntry {
  source: NewsSource;
}

export interface IngestionResult {
  articlesAdded: number;
  feedsFailed: number;
  topStories: number;
}

const HOUR_IN_MS = 60 * 60 * 1000;
const FEED_CONCURRENCY = 6;
const ARTICLE_CONCURRENCY = 8;
const MAX_ENTRIES_PER_FEED = 20;
const MAX_ENTRY_AGE_HOURS = 48;
const MIN_EXTRACTED_WORDS = 120;
const WORDS_PER_MINUTE = 220;
const RETENTION_DAYS = 30;
const TOP_STORIES_WINDOW_HOURS = 24;
const TOP_STORIES_LIMIT = 25;
const INSERT_CHUNK_SIZE = 200;
const LISTING_PAGE_TITLE = /\bpage \d+\b/i;
const PUBLISHER_SUFFIX = /\s+-\s+[^-]+$/;

function fromAggregator(entry: FeedEntry): FeedEntry | null {
  if (LISTING_PAGE_TITLE.test(entry.title)) return null;
  return { ...entry, title: entry.title.replace(PUBLISHER_SUFFIX, ""), snippet: "" };
}

async function readSource(source: NewsSource): Promise<Candidate[]> {
  const entries = await readFeed(source.feedUrl);
  const usable = source.aggregated ? entries.flatMap((entry) => fromAggregator(entry) ?? []) : entries;
  return usable.slice(0, MAX_ENTRIES_PER_FEED).map((entry) => ({ ...entry, source }));
}

async function collectCandidates(): Promise<{ candidates: Candidate[]; feedsFailed: number }> {
  const limit = pLimit(FEED_CONCURRENCY);
  const results = await Promise.allSettled(NEWS_SOURCES.map((source) => limit(() => readSource(source))));

  let feedsFailed = 0;
  const candidates: Candidate[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      candidates.push(...result.value);
      return;
    }
    feedsFailed += 1;
    logger.warn({ feed: NEWS_SOURCES[index]?.feedUrl, err: result.reason }, "Feed could not be read");
  });

  return { candidates, feedsFailed };
}

function selectFresh(candidates: Candidate[], now: Date): Candidate[] {
  const oldestAllowed = now.getTime() - MAX_ENTRY_AGE_HOURS * HOUR_IN_MS;
  const unique = new Map<string, Candidate>();

  for (const candidate of candidates) {
    const publishedAt = candidate.publishedAt?.getTime() ?? now.getTime();
    if (publishedAt < oldestAllowed || unique.has(candidate.url)) continue;
    unique.set(candidate.url, candidate);
  }

  return [...unique.values()];
}

async function excludeKnown(candidates: Candidate[]): Promise<Candidate[]> {
  if (candidates.length === 0) return [];
  const known = await db
    .select({ url: articles.url })
    .from(articles)
    .where(
      inArray(
        articles.url,
        candidates.map((candidate) => candidate.url),
      ),
    );
  const knownUrls = new Set(known.map((row) => row.url));
  return candidates.filter((candidate) => !knownUrls.has(candidate.url));
}

async function extract(candidate: Candidate): Promise<ExtractedArticle | null> {
  if (candidate.source.aggregated) return null;
  return extractArticle(candidate.url).catch((error: unknown) => {
    logger.debug({ url: candidate.url, err: error }, "Article extraction failed, using feed snippet");
    return null;
  });
}

async function buildArticle(candidate: Candidate, now: Date): Promise<NewArticleRow> {
  const extracted = await extract(candidate);
  const body = extracted && countWords(extracted.text) >= MIN_EXTRACTED_WORDS ? extracted.text : null;
  const summary = (body && summarize(body)) || summarize(candidate.snippet) || candidate.snippet;
  const wordCount = countWords(body ?? candidate.snippet);
  const publishedAt = candidate.publishedAt && candidate.publishedAt < now ? candidate.publishedAt : now;

  return {
    url: candidate.url,
    title: candidate.title,
    summary,
    category: candidate.source.category,
    source: candidate.source.name,
    imageUrl: candidate.imageUrl ?? extracted?.imageUrl ?? null,
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    publishedAt,
  };
}

async function insertArticles(rows: NewArticleRow[]): Promise<number> {
  let inserted = 0;
  for (let offset = 0; offset < rows.length; offset += INSERT_CHUNK_SIZE) {
    const chunk = rows.slice(offset, offset + INSERT_CHUNK_SIZE);
    const result = await db
      .insert(articles)
      .values(chunk)
      .onConflictDoNothing({ target: articles.url })
      .returning({ id: articles.id });
    inserted += result.length;
  }
  return inserted;
}

async function pruneExpiredArticles(now: Date): Promise<void> {
  const cutoff = new Date(now.getTime() - RETENTION_DAYS * 24 * HOUR_IN_MS);
  await db
    .delete(articles)
    .where(
      and(
        lt(articles.publishedAt, cutoff),
        notExists(db.select().from(bookmarks).where(eq(bookmarks.articleId, articles.id))),
      ),
    );
}

export async function refreshTopStories(now = new Date()): Promise<number> {
  const since = new Date(now.getTime() - TOP_STORIES_WINDOW_HOURS * HOUR_IN_MS);
  const recent = await db
    .select({
      id: articles.id,
      title: articles.title,
      summary: articles.summary,
      source: articles.source,
      imageUrl: articles.imageUrl,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .where(gte(articles.publishedAt, since));

  const ranked = rankStories(recent, now, TOP_STORIES_LIMIT);

  await db.transaction(async (tx) => {
    await tx.delete(topStories);
    if (ranked.length === 0) return;
    await tx.insert(topStories).values(
      ranked.map((story, index) => ({
        rank: index + 1,
        articleId: story.lead.id,
        coverage: story.coverage,
        computedAt: now,
      })),
    );
  });

  return ranked.length;
}

export async function runIngestion(): Promise<IngestionResult> {
  const now = new Date();
  const { candidates, feedsFailed } = await collectCandidates();
  const fresh = await excludeKnown(selectFresh(candidates, now));

  logger.info({ candidates: candidates.length, fresh: fresh.length, feedsFailed }, "Feeds collected");

  const limit = pLimit(ARTICLE_CONCURRENCY);
  const rows = await Promise.all(fresh.map((candidate) => limit(() => buildArticle(candidate, now))));
  const articlesAdded = await insertArticles(rows);

  await pruneExpiredArticles(now);
  const topStoryCount = await refreshTopStories(now);

  return { articlesAdded, feedsFailed, topStories: topStoryCount };
}
