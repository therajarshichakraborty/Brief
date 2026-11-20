import { Flame } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ArticleRow } from "@/components/news/article-row";
import { EmptyState } from "@/components/news/empty-state";
import { formatTime } from "@/lib/format";
import { getTopStories } from "@/lib/server-api";

export const metadata: Metadata = { title: "Top stories" };

export default async function TopStoriesPage() {
  const { computedAt, items } = await getTopStories();

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Top stories"
        description={
          computedAt ? (
            <span suppressHydrationWarning>
              The most covered stories of the day, refreshed hourly. Last updated at {formatTime(computedAt)}.
            </span>
          ) : (
            "The most covered stories of the day, refreshed hourly."
          )
        }
      />

      {items.length > 0 ? (
        <div className="divide-y divide-neutral-100">
          {items.map((story, index) => (
            <ArticleRow key={story.id} article={story} index={index} rank={story.rank} coverage={story.coverage} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Flame} title="No top stories yet" description="They will appear after the next sync." />
      )}
    </div>
  );
}
