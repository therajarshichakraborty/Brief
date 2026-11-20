import {
  CalendarClock,
  ChevronLeft,
  Clock,
  Heart,
  House,
  Layers,
  Newspaper,
  Search,
  Send,
  Tag,
  User,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@news-aggrigator/contracts";
import Image from "next/image";
import { Wordmark } from "@/components/brand/logo";
import { categoryImage } from "@/lib/category-images";
import { cn } from "@/lib/utils";

const NAV_ICONS: readonly LucideIcon[] = [House, Clock, Heart, User];

const DETAIL_META: readonly { icon: LucideIcon; label: string }[] = [
  { icon: Clock, label: "4 min" },
  { icon: CalendarClock, label: "2h ago" },
  { icon: Tag, label: "Politics" },
];

function Photo({ category, sizes }: { category: Category; sizes: string }) {
  return (
    <>
      <Image src={categoryImage(category)} alt="" fill sizes={sizes} className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10" />
    </>
  );
}

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative h-140 w-68 shrink-0 overflow-hidden rounded-[2.75rem] border-10 border-neutral-100 bg-background shadow-2xl shadow-black/30",
        className,
      )}
    >
      {children}
    </div>
  );
}

const LATEST_ROWS: readonly { category: Category; meta: string; title: string; time: string }[] = [
  {
    category: "technology",
    meta: "Technology · The Verge",
    title: "Chipmakers race to build the next generation of AI accelerators",
    time: "18m ago · 3 min read",
  },
  {
    category: "health",
    meta: "Health · Reuters",
    title: "New study links daily walks to sharper memory in later life",
    time: "41m ago · 2 min read",
  },
];

export function LatestScreen() {
  return (
    <div className="flex h-full flex-col bg-background pt-7">
      <div className="flex items-center justify-between px-5">
        <Wordmark className="text-xl text-neutral-900" />
        <span className="flex items-center gap-1.5 rounded-full bg-neutral-50 px-2.5 py-1 text-[9px] font-medium text-neutral-500">
          <span className="size-1.5 rounded-full bg-red-500" />
          Live
        </span>
      </div>

      <div className="mt-4 px-5">
        <p className="text-[10px] font-medium tracking-wide text-neutral-400 uppercase">Today&apos;s briefing</p>
        <p className="mt-1 font-display text-[1.35rem] leading-tight font-semibold text-neutral-900">Latest news</p>
      </div>

      <div className="mx-5 mt-4">
        <div className="relative h-32 overflow-hidden rounded-2xl shadow-md shadow-black/10">
          <Image src={categoryImage("world")} alt="" fill sizes="232px" className="object-cover" />
          <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-black backdrop-blur">
            World
          </span>
        </div>
        <p className="mt-2.5 text-[9px] font-medium text-neutral-400">World · Al Jazeera</p>
        <p className="mt-0.5 line-clamp-2 font-display text-[13px] leading-snug font-semibold text-neutral-900">
          Leaders gather for summit as ceasefire talks enter final day
        </p>
        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-neutral-500">
          Negotiators say a draft agreement is close, with aid corridors and a prisoner exchange on the table.
        </p>
      </div>

      <div className="mx-5 mt-2 divide-y divide-neutral-100">
        {LATEST_ROWS.map((row) => (
          <div key={row.title} className="flex gap-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-[8.5px] font-medium text-neutral-400">{row.meta}</p>
              <p className="mt-0.5 line-clamp-2 font-display text-[11px] leading-snug font-semibold text-neutral-900">
                {row.title}
              </p>
              <p className="mt-1 text-[8.5px] text-neutral-400">{row.time}</p>
            </div>
            <div className="relative size-13 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              <Image src={categoryImage(row.category)} alt="" fill sizes="52px" className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniCard({
  category,
  title,
  source,
  coverage,
}: {
  category: Category;
  title: string;
  source: string;
  coverage: number;
}) {
  return (
    <div className="relative h-52 w-38 shrink-0 overflow-hidden rounded-[1.25rem] shadow-lg shadow-black/20">
      <Photo category={category} sizes="152px" />
      <span className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
        <Heart className="size-3.5" />
      </span>
      <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/45 p-2.5 text-white backdrop-blur-md">
        <p className="line-clamp-2 font-display text-xs leading-snug font-semibold">{title}</p>
        <div className="mt-1.5 flex items-center justify-between text-[9px] text-white/80">
          <span className="flex items-center gap-1">
            <Newspaper className="size-2.5" />
            {source}
          </span>
          <span className="flex items-center gap-0.5">
            <Layers className="size-2.5" />
            {coverage}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FeedScreen() {
  return (
    <div className="flex h-full flex-col pt-8">
      <div className="flex items-start justify-between px-5">
        <div>
          <p className="font-display text-lg font-semibold text-neutral-900">Hi, Alex</p>
          <p className="text-[11px] text-neutral-500">Updated 4 minutes ago</p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-[#0b74c1] to-[#04205c] font-display text-[11px] font-semibold text-white">
          AK
        </span>
      </div>

      <div className="mx-5 mt-5 flex h-10 items-center justify-between rounded-xl border border-neutral-200 pr-2 pl-3 text-[11px] text-neutral-400">
        Search stories
        <span className="flex items-center gap-2">
          <span className="h-4 w-px bg-neutral-200" />
          <Search className="size-3.5 text-neutral-600" />
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-between px-5">
        <p className="font-display text-sm font-semibold text-neutral-900">Top stories</p>
        <p className="text-[10px] text-neutral-500">View all</p>
      </div>

      <div className="mt-3 flex gap-2 px-5">
        {["World", "India", "Cricket"].map((label, index) => (
          <span
            key={label}
            className={cn(
              "rounded-xl px-3 py-2 text-[10px] font-medium",
              index === 0 ? "bg-neutral-900 text-neutral-50 shadow-md" : "bg-neutral-50 text-neutral-400",
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-3 overflow-hidden pl-5">
        <MiniCard
          category="business"
          title="Markets rally as central bank holds rates steady"
          source="BBC News"
          coverage={6}
        />
        <MiniCard
          category="cricket"
          title="Final-over chase seals the series decider"
          source="ESPNcricinfo"
          coverage={5}
        />
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-neutral-100 px-4 pt-3 pb-4 text-neutral-400">
        {NAV_ICONS.map((Icon, index) => (
          <span key={Icon.displayName ?? index} className="flex flex-col items-center gap-1">
            <Icon className={cn("size-4.5", index === 0 && "fill-current text-neutral-900")} strokeWidth={1.75} />
            <span className={cn("size-1 rounded-full", index === 0 ? "bg-red-500" : "bg-transparent")} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function DetailScreen() {
  return (
    <div className="flex h-full flex-col p-2">
      <div className="relative h-68 overflow-hidden rounded-[1.75rem] shadow-lg">
        <Photo category="politics" sizes="256px" />
        <span className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
          <ChevronLeft className="size-4" />
        </span>
        <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
          <Heart className="size-4" />
        </span>
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/45 p-3 text-white backdrop-blur-md">
          <p className="font-display text-sm leading-snug font-semibold">
            Lawmakers back landmark climate bill after late-night vote
          </p>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-white/80">
            <Newspaper className="size-3" />
            The Guardian
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pt-4">
        <div className="flex items-baseline gap-5">
          <span className="font-display text-sm font-semibold text-neutral-900">Summary</span>
          <span className="text-[11px] text-neutral-400">Details</span>
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-neutral-600">
          {DETAIL_META.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-md bg-neutral-100">
                <Icon className="size-3 text-neutral-800" />
              </span>
              {label}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
          The bill commits the country to net zero by 2045 and creates an independent body to track progress. It now
          moves to the upper house for final approval.
        </p>
        <span className="mt-auto mb-1 flex h-10 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 text-[11px] font-medium text-neutral-50">
          Read full story
          <Send className="size-3.5" />
        </span>
      </div>
    </div>
  );
}
