import type { Category } from "@news-aggrigator/contracts";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  query?: string;
  category?: Category;
  className?: string;
}

export function SearchBar({ query, category, className }: SearchBarProps) {
  return (
    <form
      action="/feed"
      role="search"
      className={cn(
        "group flex h-14 items-center rounded-2xl border border-neutral-200 pr-2 pl-5 transition-all duration-300 focus-within:border-neutral-400 focus-within:shadow-lg focus-within:shadow-black/5",
        className,
      )}
    >
      {category && <input type="hidden" name="category" value={category} />}
      <input
        type="search"
        name="q"
        defaultValue={query}
        maxLength={100}
        placeholder="Search stories"
        aria-label="Search stories"
        className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
      />
      <span className="mx-3 h-7 w-px bg-neutral-200" />
      <button
        type="submit"
        aria-label="Search"
        className="flex size-10 items-center justify-center rounded-xl text-neutral-600 transition duration-200 hover:bg-neutral-100 active:scale-90"
      >
        <Search className="size-5 transition-transform duration-300 group-focus-within:scale-110" />
      </button>
    </form>
  );
}
