import { Heart } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ArticleRow } from "@/components/news/article-row";
import { EmptyState } from "@/components/news/empty-state";
import { getBookmarks } from "@/lib/server-api";

export const metadata: Metadata = { title: "Saved" };

export default async function SavedPage() {
  const items = await getBookmarks();

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Saved" description="Stories you have kept for later." />

      {items.length > 0 ? (
        <div className="divide-y divide-neutral-100">
          {items.map((article, index) => (
            <ArticleRow key={article.id} article={article} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Heart} title="Nothing saved yet" description="Tap the heart on any story to keep it here." />
      )}
    </div>
  );
}
