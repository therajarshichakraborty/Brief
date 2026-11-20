"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { type Theme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const OPTIONS: readonly { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

interface ThemeToggleProps {
  className?: string;
  /** Show text labels next to the icons (used on the profile page). */
  withLabels?: boolean;
  /** Translucent style for use on top of photos. */
  overlay?: boolean;
}

export function ThemeToggle({ className, withLabels = false, overlay = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const activeIndex = OPTIONS.findIndex((option) => option.value === theme);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "relative inline-grid grid-cols-3 rounded-full p-1",
        overlay ? "border border-white/20 bg-black/25 backdrop-blur-md" : "border border-neutral-200 bg-neutral-50",
        withLabels && "w-full max-w-sm",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full shadow-sm transition-transform duration-300 ease-out-expo",
          overlay ? "bg-white/90" : "bg-background ring-1 ring-neutral-200/70",
        )}
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = value === theme;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={withLabels ? undefined : label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 rounded-full transition-colors duration-300",
              withLabels ? "h-9 px-3 text-sm font-medium" : "size-7",
              overlay
                ? isActive
                  ? "text-black"
                  : "text-white/80 hover:text-white"
                : isActive
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-700",
            )}
          >
            <Icon className={withLabels ? "size-4" : "size-3.5"} strokeWidth={2} />
            {withLabels && label}
          </button>
        );
      })}
    </div>
  );
}
