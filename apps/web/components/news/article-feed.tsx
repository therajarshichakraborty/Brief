"use client";

import type { Article, Category } from "@news-aggrigator/contracts";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { fetchArticlePage } from "@/lib/client-api";
import { ArticleRow } from "./article-row";

interface ArticleFeedProps {
  initialItems: Article[];
  initialCursor: string | null;
  category?: Category;
  query?: string;
}

const PAGE_SIZE = 20;

export function ArticleFeed({ initialItems, initialCursor, category, query }: ArticleFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    if (!cursor) return;
    const params = new URLSearchParams({ cursor, limit: String(PAGE_SIZE) });
    if (category) params.set("category", category);
    if (query) params.set("q", query);

    startTransition(async () => {
      try {
        const page = await fetchArticlePage(params);
        setItems((current) => [...current, ...page.items]);
        setCursor(page.nextCursor);
        setError(null);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not load more stories");
      }
    });
  }

  return (
    <div>
      <div className="divide-y divide-neutral-100">
        {items.map((article, index) => (
          <ArticleRow key={article.id} article={article} index={index % PAGE_SIZE} />
        ))}
      </div>

      {error && <p className="py-2 text-center text-sm text-destructive">{error}</p>}

      {cursor && (
        <Button
          variant="outline"
          onClick={loadMore}
          disabled={isPending}
          className="mt-4 h-12 w-full rounded-2xl border-neutral-200 shadow-none"
        >
          {isPending ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}
