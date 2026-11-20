"use client";

import { CATEGORIES, CATEGORY_LABELS } from "@news-aggrigator/contracts";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { useSync } from "@/components/sync/sync-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { isNavItemActive, NAV_ITEMS } from "./nav-items";

interface SidebarProps {
  user: { name: string; email: string };
}

function SyncCard() {
  const { isSyncing, status, sync } = useSync();

  return (
    <div className="space-y-3 rounded-2xl bg-neutral-50 p-4">
      <p key={status} className="animate-fade-in text-xs text-neutral-500" suppressHydrationWarning>
        {status}
      </p>
      <button
        type="button"
        onClick={sync}
        disabled={isSyncing}
        className="group flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 text-sm font-medium text-neutral-50 transition duration-200 hover:bg-neutral-800 active:scale-[0.97] disabled:opacity-60"
      >
        <RefreshCw
          className={cn(
            "size-4",
            isSyncing ? "animate-spin" : "transition-transform duration-500 ease-out-expo group-hover:rotate-180",
          )}
        />
        {isSyncing ? "Syncing…" : "Sync now"}
      </button>
    </div>
  );
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = pathname === "/feed" ? searchParams.get("category") : null;

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-neutral-100 bg-background lg:flex">
      <div className="px-7 pt-7 pb-5">
        <Logo href="/feed" className="text-neutral-900" />
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-4">
        <nav aria-label="Primary" className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = isNavItemActive(href, pathname) && !(href === "/feed" && activeCategory);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-medium transition-all duration-300 ease-out-expo active:scale-[0.97]",
                  isActive
                    ? "bg-neutral-900 text-neutral-50"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                <Icon
                  className="size-5 transition-transform duration-300 ease-spring group-hover:scale-110"
                  strokeWidth={1.75}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <nav aria-label="Categories" className="space-y-1">
          <p className="px-3 pb-2 text-xs font-medium tracking-wider text-neutral-400 uppercase">Categories</p>
          {CATEGORIES.map((category) => {
            const isActive = category === activeCategory;
            return (
              <Link
                key={category}
                href={`/feed?category=${category}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-1.5 text-sm transition-all duration-300 ease-out-expo",
                  isActive
                    ? "font-medium text-neutral-900"
                    : "text-neutral-500 hover:translate-x-1 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-colors duration-300",
                    isActive ? "animate-dot-in bg-red-500" : "bg-neutral-300 group-hover:bg-neutral-500",
                  )}
                />
                {CATEGORY_LABELS[category]}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 border-t border-neutral-100 p-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">Theme</span>
          <ThemeToggle />
        </div>
        <SyncCard />
        <Link
          href="/profile"
          className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition duration-300 hover:bg-neutral-50"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#0b74c1] to-[#04205c] font-display text-xs font-semibold text-white transition-transform duration-300 ease-spring group-hover:scale-110">
            {initials(user.name)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-neutral-900">{user.name}</span>
            <span className="block truncate text-xs text-neutral-500">{user.email}</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
