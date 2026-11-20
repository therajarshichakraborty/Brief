"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSync } from "./sync-provider";

export function SyncButton({ className }: { className?: string }) {
  const { isSyncing, sync } = useSync();

  return (
    <button
      type="button"
      onClick={sync}
      disabled={isSyncing}
      aria-label="Sync news"
      className={cn(
        "group flex size-12 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition duration-200 hover:bg-neutral-50 active:scale-90 disabled:opacity-60",
        className,
      )}
    >
      <RefreshCw
        className={cn(
          "size-5",
          isSyncing ? "animate-spin" : "transition-transform duration-500 ease-out-expo group-hover:rotate-180",
        )}
      />
    </button>
  );
}

export function SyncStatus({ className }: { className?: string }) {
  const { status } = useSync();

  return (
    <p key={status} className={cn("animate-fade-in", className)} suppressHydrationWarning>
      {status}
    </p>
  );
}
