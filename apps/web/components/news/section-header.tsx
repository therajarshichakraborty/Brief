import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  action?: { href: string; label: string };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="font-display text-xl font-semibold text-neutral-900">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="group flex items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          {action.label}
          <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
      )}
    </div>
  );
}
