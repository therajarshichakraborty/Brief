import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex animate-fade-up flex-col items-center gap-3 py-16 text-center">
      <span className="flex size-14 animate-float items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
        <Icon className="size-6" />
      </span>
      <p className="font-display font-semibold text-neutral-900">{title}</p>
      <p className="max-w-xs text-sm text-neutral-500">{description}</p>
    </div>
  );
}
