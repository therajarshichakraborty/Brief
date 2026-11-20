import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#categories", label: "Categories" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="animate-in duration-500 fade-in-0 slide-in-from-top-2">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6">
        <Logo className="text-neutral-900" />

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="relative text-sm font-medium text-neutral-500 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-neutral-900 after:transition-transform after:duration-300 hover:text-neutral-900 hover:after:scale-x-100"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="mr-1 hidden sm:inline-grid" />
          <Button asChild variant="ghost" className="h-10 rounded-xl px-4">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="h-10 rounded-xl px-4">
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
