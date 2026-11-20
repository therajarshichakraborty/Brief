"use client";

import type { SyncRun } from "@news-aggrigator/contracts";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchLatestSync, triggerSync } from "@/lib/client-api";
import { timeAgo } from "@/lib/format";

const POLL_INTERVAL_MS = 3000;

interface SyncState {
  isSyncing: boolean;
  status: string;
  sync: () => Promise<void>;
}

const SyncContext = createContext<SyncState | null>(null);

function describe(run: SyncRun | null, error: string | null): string {
  if (error) return error;
  if (!run) return "No stories synced yet";
  if (run.status === "running") return "Syncing the latest stories…";
  if (run.status === "failed") return "Last sync failed, try again";
  return `Updated ${timeAgo(run.finishedAt ?? run.startedAt)}`;
}

export function SyncProvider({ initialRun, children }: { initialRun: SyncRun | null; children: React.ReactNode }) {
  const router = useRouter();
  const [run, setRun] = useState(initialRun);
  const [error, setError] = useState<string | null>(null);
  const isSyncing = run?.status === "running";

  useEffect(() => {
    if (!isSyncing) return;
    const timer = setInterval(async () => {
      const latest = await fetchLatestSync().catch(() => null);
      if (!latest || latest.run?.status === "running") return;
      setRun(latest.run);
      router.refresh();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isSyncing, router]);

  const sync = useCallback(async () => {
    setError(null);
    try {
      setRun(await triggerSync());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start sync");
    }
  }, []);

  const value = useMemo(() => ({ isSyncing, status: describe(run, error), sync }), [isSyncing, run, error, sync]);

  return <SyncContext value={value}>{children}</SyncContext>;
}

export function useSync(): SyncState {
  const context = useContext(SyncContext);
  if (!context) throw new Error("useSync must be used within a SyncProvider");
  return context;
}
