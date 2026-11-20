import type { Category } from "./categories";

export interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: Category;
  imageUrl: string | null;
  readingMinutes: number;
  publishedAt: string;
  bookmarked: boolean;
}

export interface ArticlePage {
  items: Article[];
  nextCursor: string | null;
}

export interface TopStory extends Article {
  rank: number;
  coverage: number;
}

export interface TopStories {
  computedAt: string | null;
  items: TopStory[];
}

export type SyncTrigger = "manual" | "scheduled";

export type SyncStatus = "running" | "succeeded" | "failed";

export interface SyncRun {
  id: string;
  trigger: SyncTrigger;
  status: SyncStatus;
  articlesAdded: number;
  startedAt: string;
  finishedAt: string | null;
}

export interface LatestSync {
  run: SyncRun | null;
}
