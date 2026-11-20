"use client";

import { type Article, CATEGORY_LABELS } from "@news-aggrigator/contracts";
import { CalendarClock, Clock, type LucideIcon, Tag } from "lucide-react";
import { useState } from "react";
import { formatDateTime, timeAgo } from "@/lib/format";
import { stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TABS = ["Summary", "Details"] as const;

type Tab = (typeof TABS)[number];

function MetaChip({ icon: Icon, index, children }: { icon: LucideIcon; index: number; children: React.ReactNode }) {
  return (
    <span style={stagger(index, 70)} className="group flex animate-fade-up items-center gap-2 text-sm text-neutral-600">
      <span className="flex size-8 items-center justify-center rounded-lg bg-neutral-100 transition-transform duration-300 ease-spring group-hover:scale-110">
        <Icon className="size-4 text-neutral-800" />
      </span>
      {children}
    </span>
  );
}

export function ArticleTabs({ article }: { article: Article }) {
  const [tab, setTab] = useState<Tab>("Summary");
  const rows: [string, string][] = [
    ["Source", article.source],
    ["Category", CATEGORY_LABELS[article.category]],
    ["Published", formatDateTime(article.publishedAt)],
    ["Reading time", `${article.readingMinutes} min`],
    ["Website", new URL(article.url).hostname.replace(/^www\./, "")],
  ];

  return (
    <section className="space-y-6">
      <div role="tablist" className="flex items-baseline gap-8">
        {TABS.map((name) => {
          const isActive = tab === name;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(name)}
              className={cn(
                "relative pb-1.5 transition-all duration-300 ease-out-expo",
                isActive
                  ? "font-display text-xl font-semibold text-neutral-900"
                  : "text-[15px] font-medium text-neutral-400 hover:text-neutral-600",
              )}
            >
              {name}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-neutral-900 transition-transform duration-500 ease-out-expo",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}
      </div>

      {tab === "Summary" ? (
        <div key="summary" role="tabpanel" className="animate-fade-up space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <MetaChip icon={Clock} index={0}>
              {article.readingMinutes} min read
            </MetaChip>
            <MetaChip icon={CalendarClock} index={1}>
              <span suppressHydrationWarning>{timeAgo(article.publishedAt)}</span>
            </MetaChip>
            <MetaChip icon={Tag} index={2}>
              {CATEGORY_LABELS[article.category]}
            </MetaChip>
          </div>
          {article.summary ? (
            <p className="text-[17px] leading-relaxed text-neutral-600">{article.summary}</p>
          ) : (
            <p className="rounded-2xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-500">
              {article.source} does not allow automated reading, so only the headline is available here. Open the full
              story to read it on their site.
            </p>
          )}
        </div>
      ) : (
        <dl key="details" role="tabpanel" className="animate-fade-up divide-y divide-neutral-100">
          {rows.map(([label, value], index) => (
            <div
              key={label}
              style={stagger(index, 50)}
              className="flex animate-fade-up justify-between gap-6 py-3 text-sm"
            >
              <dt className="text-neutral-400">{label}</dt>
              <dd className="text-right font-medium text-neutral-800">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
