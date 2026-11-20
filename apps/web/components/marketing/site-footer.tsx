import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#categories", label: "Categories" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/signup", label: "Create account" },
      { href: "/login", label: "Sign in" },
      { href: "/forgot-password", label: "Reset password" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo className="text-neutral-900" />
          <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
            Every story that matters, summarised and refreshed every hour.
          </p>
        </div>
        {COLUMNS.map(({ title, links }) => (
          <div key={title}>
            <p className="text-sm font-semibold text-neutral-900">{title}</p>
            <ul className="mt-4 space-y-3">
              {links.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-neutral-500 transition hover:text-neutral-900">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-100">
        <p className="mx-auto max-w-6xl px-6 py-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} Brief. Headlines belong to their respective publishers.
        </p>
      </div>
    </footer>
  );
}
