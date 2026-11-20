import { CalendarDays, Heart, type LucideIcon, RefreshCw, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { CountUp } from "@/components/motion/count-up";
import { ArticleRow } from "@/components/news/article-row";
import { SectionHeader } from "@/components/news/section-header";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { formatMonthYear, initials, timeAgo } from "@/lib/format";
import { stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { getBookmarks, getLatestSync, requireUser } from "@/lib/server-api";

export const metadata: Metadata = { title: "Profile" };

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const RECENT_SAVES = 3;

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  index: number;
  className?: string;
  children: React.ReactNode;
}

function StatTile({ icon: Icon, label, index, className, children }: StatTileProps) {
  return (
    <div
      style={stagger(index, 80, 150)}
      className={cn(
        "group animate-fade-up rounded-3xl border border-neutral-100 p-4 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 sm:p-5",
        className,
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition-transform duration-300 ease-spring group-hover:scale-110 group-hover:-rotate-6">
        <Icon className="size-4" />
      </span>
      <p className="mt-4 font-display text-xl font-semibold text-neutral-900 sm:text-2xl">{children}</p>
      <p className="mt-0.5 text-xs text-neutral-500 sm:text-sm">{label}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const [user, bookmarks, { run }] = await Promise.all([requireUser(), getBookmarks(), getLatestSync()]);
  const memberDays = Math.max(1, Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / DAY_IN_MS));
  const lastUpdated = run?.finishedAt ? timeAgo(run.finishedAt) : "Not yet";

  return (
    <div className="max-w-3xl space-y-8">
      <section className="animate-fade-up overflow-hidden rounded-[2rem] border border-neutral-100">
        <div className="relative h-32 overflow-hidden bg-linear-to-br from-[#2f7fc4] via-[#2563b0] to-[#1d4c99] sm:h-36">
          <div className="absolute -top-16 left-1/4 size-48 animate-float rounded-full bg-white/10" />
          <div className="absolute -right-10 -bottom-20 size-56 animate-float rounded-full bg-white/5 [animation-delay:1.5s]" />
          <Sparkles className="absolute top-5 right-6 size-5 animate-pulse text-white/60" />
        </div>

        <div className="px-6 pb-6">
          <span className="relative z-10 -mt-12 flex size-24 animate-in items-center justify-center rounded-full bg-linear-to-br from-[#0b74c1] to-[#04205c] font-display text-2xl font-semibold text-white shadow-xl ring-4 ring-background duration-700 ease-spring zoom-in-50 fade-in-0">
            {initials(user.name)}
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-neutral-900">{user.name}</h1>
          <p className="text-neutral-500">{user.email}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
            <CalendarDays className="size-3.5" />
            Member since {formatMonthYear(user.createdAt)}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatTile icon={Heart} label="Saved stories" index={0}>
          <CountUp value={bookmarks.length} />
        </StatTile>
        <StatTile icon={CalendarDays} label={memberDays === 1 ? "Day with Brief" : "Days with Brief"} index={1}>
          <CountUp value={memberDays} />
        </StatTile>
        <StatTile icon={RefreshCw} label="Feed updated" index={2} className="col-span-2 sm:col-span-1">
          <span className="block truncate text-base sm:text-lg" suppressHydrationWarning>
            {lastUpdated}
          </span>
        </StatTile>
      </section>

      <section className="animate-fade-up space-y-2 [animation-delay:300ms]">
        <SectionHeader
          title="Recently saved"
          action={bookmarks.length > RECENT_SAVES ? { href: "/saved", label: "View all" } : undefined}
        />
        {bookmarks.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {bookmarks.slice(0, RECENT_SAVES).map((article, index) => (
              <ArticleRow key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-500">
            Tap the heart on any story and it will show up here.
          </p>
        )}
      </section>

      <section className="animate-fade-up space-y-4 [animation-delay:340ms]">
        <h2 className="font-display text-xl font-semibold text-neutral-900">Appearance</h2>
        <div className="flex flex-col gap-4 rounded-3xl border border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-neutral-900">Theme</p>
            <p className="text-sm text-neutral-500">Pick a look, or follow your device setting.</p>
          </div>
          <ThemeToggle withLabels className="sm:w-auto" />
        </div>
      </section>

      <section className="animate-fade-up space-y-4 [animation-delay:380ms]">
        <h2 className="font-display text-xl font-semibold text-neutral-900">Security</h2>
        <div className="rounded-3xl border border-neutral-100 p-5">
          <ChangePasswordForm />
        </div>
      </section>

      <div className="animate-fade-up [animation-delay:440ms]">
        <SignOutButton />
      </div>
    </div>
  );
}
