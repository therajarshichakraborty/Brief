import { Newspaper, Send } from "lucide-react";
import type { Metadata } from "next";
import { BackButton } from "@/components/layout/back-button";
import { ArticleImage } from "@/components/news/article-image";
import { ArticleTabs } from "@/components/news/article-tabs";
import { BookmarkButton } from "@/components/news/bookmark-button";
import { Button } from "@/components/ui/button";
import { getArticle } from "@/lib/server-api";

export async function generateMetadata({ params }: PageProps<"/articles/[id]">): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  return { title: article.title };
}

export default async function ArticlePage({ params }: PageProps<"/articles/[id]">) {
  const { id } = await params;
  const article = await getArticle(id);

  return (
    <article className="-mx-3 -mt-7 lg:mx-0 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
      <div className="relative h-104 animate-fade-up overflow-hidden rounded-[2rem] shadow-xl shadow-black/15 lg:sticky lg:top-10 lg:aspect-4/5 lg:h-auto">
        <div className="absolute inset-0 animate-in duration-1000 ease-out-expo zoom-in-110 fade-in-0">
          <ArticleImage
            src={article.imageUrl}
            category={article.category}
            alt=""
            sizes="(min-width: 1024px) 520px, 100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20" />

        <BackButton className="absolute top-5 left-5" />
        <BookmarkButton articleId={article.id} bookmarked={article.bookmarked} className="absolute top-5 right-5" />

        <div
          style={{ animationDelay: "200ms" }}
          className="absolute inset-x-4 bottom-4 animate-fade-up rounded-2xl bg-black/45 p-4 text-white backdrop-blur-md lg:inset-x-5 lg:bottom-5 lg:p-5"
        >
          <h1 className="line-clamp-3 font-display text-xl leading-snug font-semibold lg:text-2xl">{article.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
            <Newspaper className="size-4" />
            {article.source}
          </p>
        </div>
      </div>

      <div style={{ animationDelay: "150ms" }} className="animate-fade-up px-4 pt-8 lg:px-0 lg:pt-2">
        <ArticleTabs article={article} />

        <div className="fixed inset-x-0 bottom-0 z-20 bg-linear-to-t from-background via-background to-background/0 px-7 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:static lg:mt-10 lg:bg-none lg:p-0">
          <Button
            asChild
            className="group mx-auto flex h-14 w-full max-w-lg rounded-2xl text-base shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30"
          >
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read full story
              <Send className="size-5 transition-transform duration-300 ease-spring group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
