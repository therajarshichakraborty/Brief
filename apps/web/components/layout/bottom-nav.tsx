"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isNavItemActive, NAV_ITEMS } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/articles/")) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-100 bg-background/85 backdrop-blur-lg lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-center justify-around px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = isNavItemActive(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-3 transition duration-300 active:scale-90",
                  isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600",
                )}
              >
                <Icon
                  className={cn(
                    "size-6 transition-transform duration-300 ease-spring",
                    isActive && "-translate-y-0.5",
                    isActive && href === "/feed" && "fill-current",
                  )}
                  strokeWidth={1.75}
                />
                <span
                  className={cn("size-1.5 rounded-full", isActive ? "animate-dot-in bg-red-500" : "bg-transparent")}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
