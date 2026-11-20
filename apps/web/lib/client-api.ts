import type { ArticlePage, LatestSync, SyncRun } from "@news-aggrigator/contracts";

async function send<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { credentials: "same-origin", ...init });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed with status ${response.status}`);
  }

  return (response.status === 204 ? undefined : await response.json()) as T;
}

export function fetchArticlePage(params: URLSearchParams): Promise<ArticlePage> {
  return send<ArticlePage>(`/api/news?${params}`);
}

export function setBookmark(articleId: string, bookmarked: boolean): Promise<void> {
  return send<void>(`/api/bookmarks/${articleId}`, { method: bookmarked ? "PUT" : "DELETE" });
}

export function triggerSync(): Promise<SyncRun> {
  return send<SyncRun>("/api/sync", { method: "POST" });
}

export function fetchLatestSync(): Promise<LatestSync> {
  return send<LatestSync>("/api/sync/latest");
}
