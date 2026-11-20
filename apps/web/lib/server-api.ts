import type { Article, ArticlePage, Category, LatestSync, TopStories } from "@news-aggrigator/contracts";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
}

async function request<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const response = await fetch(`${API_URL}${path}`, {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (response.status === 401) redirect("/login");
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error(`API request to ${path} failed with status ${response.status}`);

  return response.json() as Promise<T>;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await request<{ user: SessionUser } | null>("/api/auth/get-session");
  return session?.user ?? null;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

interface ArticleQuery {
  category?: Category;
  q?: string;
  limit?: number;
}

export function getArticles({ category, q, limit = 20 }: ArticleQuery = {}): Promise<ArticlePage> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  return request<ArticlePage>(`/api/news?${params}`);
}

export function getTopStories(limit = 25): Promise<TopStories> {
  return request<TopStories>(`/api/news/top?limit=${limit}`);
}

export function getArticle(id: string): Promise<Article> {
  return request<Article>(`/api/news/${encodeURIComponent(id)}`);
}

export async function getBookmarks(): Promise<Article[]> {
  const { items } = await request<{ items: Article[] }>("/api/bookmarks");
  return items;
}

export function getLatestSync(): Promise<LatestSync> {
  return request<LatestSync>("/api/sync/latest");
}
