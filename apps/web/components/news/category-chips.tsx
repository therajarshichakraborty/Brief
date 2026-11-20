"use client";

import { CATEGORIES, CATEGORY_LABELS, type Category } from "@news-aggrigator/contracts";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  active?: Category;
  query?: string;
}

function hrefFor(category: Category | undefined, query: string | undefined): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/feed?${search}` : "/feed";
}

export function CategoryChips({ active, query }: CategoryChipsProps) {
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const options: { value: Category | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    ...CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] })),
  ];

  useEffect(() => {
    const nav = navRef.current;
    const chip = activeRef.current;
    if (!nav || !chip || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: chip.offsetLeft - (nav.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      ref={navRef}
      aria-label="Categories"
      className="scrollbar-none relative -mx-6 flex gap-3 overflow-x-auto px-6 py-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
    >
      {options.map(({ value, label }) => {
        const isActive = value === active;
        return (
          <Link
            key={label}
            ref={isActive ? activeRef : undefined}
            href={hrefFor(value, query)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-300 ease-out-expo active:scale-95 lg:py-2.5",
              isActive
                ? "bg-neutral-900 text-neutral-50 shadow-lg shadow-black/25"
                : "bg-neutral-50 text-neutral-400 hover:-translate-y-0.5 hover:bg-neutral-100 hover:text-neutral-700",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
