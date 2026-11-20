import { isCategory } from "@news-aggrigator/contracts";
import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import { HomeHeader } from "@/components/layout/home-header";
import { ArticleFeed } from "@/components/news/article-feed";
import { CategoryChips } from "@/components/news/category-chips";
import { EmptyState } from "@/components/news/empty-state";
import { SearchBar } from "@/components/news/search-bar";
import { SectionHeader } from "@/components/news/section-header";
import { StoryCard } from "@/components/news/story-card";
import { getArticles, getTopStories, requireUser } from "@/lib/server-api";

export const metadata: Metadata = { title: "Home" };

const FEATURED_COUNT = 8;

export default async function FeedPage({ searchParams }: PageProps<"/feed">) {
  const params = await searchParams;
  const category = isCategory(params.category) ? params.category : undefined;
  const query = typeof params.q === "string" ? params.q.trim() || undefined : undefined;
  const showTopStories = !query && !category;

  const [user, top, feed] = await Promise.all([
    requireUser(),
    showTopStories ? getTopStories(FEATURED_COUNT) : null,
    getArticles({ category, q: query }),
  ]);

  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <HomeHeader name={user.name} />
        <SearchBar query={query} category={category} className="animate-fade-up [animation-delay:80ms] lg:w-96" />
      </div>

      {top && top.items.length > 0 && (
        <section className="animate-fade-up space-y-5 [animation-delay:120ms]">
          <SectionHeader title="Top stories" action={{ href: "/top", label: "View all" }} />
          <div className="scrollbar-none -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
            {top.items.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} priority={index < 4} />
            ))}
          </div>
        </section>
      )}

      <section className="animate-fade-up space-y-4 [animation-delay:200ms]">
        <SectionHeader title={query ? `Results for “${query}”` : "Latest news"} />
        <CategoryChips active={category} query={query} />
        {feed.items.length > 0 ? (
          <ArticleFeed
            key={`${category ?? "all"}:${query ?? ""}`}
            initialItems={feed.items}
            initialCursor={feed.nextCursor}
            category={category}
            query={query}
          />
        ) : (
          <EmptyState
            icon={SearchX}
            title="No stories found"
            description={
              query ? "Try a different search term or category." : "Tap the sync button to fetch the latest news."
            }
          />
        )}
      </section>
    </div>
  );
}
