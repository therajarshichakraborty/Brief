import { type Article, CATEGORY_LABELS } from "@news-aggrigator/contracts";
import Link from "next/link";
import { timeAgo } from "@/lib/format";
import { stagger } from "@/lib/motion";
import { ArticleImage } from "./article-image";

interface ArticleRowProps {
  article: Article;
  index?: number;
  rank?: number;
  coverage?: number;
}

export function ArticleRow({ article, index = 0, rank, coverage }: ArticleRowProps) {
  return (
    <article style={stagger(index, 45)} className="group relative flex animate-fade-up gap-4 py-4">
      {rank !== undefined && (
        <span className="w-7 shrink-0 pt-0.5 font-mono text-sm text-neutral-400 transition-colors duration-300 group-hover:text-red-500">
          {String(rank).padStart(2, "0")}
        </span>
      )}

      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-xs font-medium text-neutral-400">
          {CATEGORY_LABELS[article.category]} · {article.source}
        </p>
        <h3 className="line-clamp-2 font-display text-[1.075rem] leading-snug font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-neutral-600">
          <Link href={`/articles/${article.id}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        {article.summary && <p className="line-clamp-3 text-sm leading-relaxed text-neutral-500">{article.summary}</p>}
        <p className="text-xs text-neutral-400" suppressHydrationWarning>
          {timeAgo(article.publishedAt)} · {article.readingMinutes} min read
          {coverage !== undefined && coverage > 1 && ` · ${coverage} sources`}
        </p>
      </div>

      <div className="relative size-22 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm transition-shadow duration-500 group-hover:shadow-lg lg:size-28">
        <ArticleImage
          src={article.imageUrl}
          category={article.category}
          alt=""
          sizes="112px"
          className="transition-transform duration-700 ease-out-expo group-hover:scale-110"
        />
      </div>
    </article>
  );
}
