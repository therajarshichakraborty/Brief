import type { TopStory } from "@news-aggrigator/contracts";
import { Layers, Newspaper } from "lucide-react";
import Link from "next/link";
import { stagger } from "@/lib/motion";
import { ArticleImage } from "./article-image";
import { BookmarkButton } from "./bookmark-button";

interface StoryCardProps {
  story: TopStory;
  index: number;
  priority?: boolean;
}

export function StoryCard({ story, index, priority }: StoryCardProps) {
  return (
    <article
      style={stagger(index, 70, 120)}
      className="group relative aspect-3/4 w-64 shrink-0 animate-fade-up snap-start overflow-hidden rounded-[1.75rem] shadow-xl shadow-black/15 transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/25 lg:w-auto"
    >
      <ArticleImage
        src={story.imageUrl}
        category={story.category}
        alt=""
        sizes="(min-width: 1024px) 240px, 256px"
        priority={priority}
        className="transition-transform duration-700 ease-out-expo group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10" />

      <Link href={`/articles/${story.id}`} className="absolute inset-0" aria-label={story.title} />

      <BookmarkButton articleId={story.id} bookmarked={story.bookmarked} className="absolute top-4 right-4" />

      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl bg-black/45 p-3.5 text-white backdrop-blur-md transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
        <h3 className="line-clamp-2 font-display text-base leading-snug font-semibold">{story.title}</h3>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-white/80">
          <span className="flex min-w-0 items-center gap-1.5">
            <Newspaper className="size-3.5 shrink-0" />
            <span className="truncate">{story.source}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1" title={`Covered by ${story.coverage} sources`}>
            <Layers className="size-3.5" />
            {story.coverage}
          </span>
        </div>
      </div>
    </article>
  );
}
