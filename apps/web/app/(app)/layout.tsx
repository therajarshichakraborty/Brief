import { Suspense } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { SyncProvider } from "@/components/sync/sync-provider";
import { getLatestSync, requireUser } from "@/lib/server-api";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, { run }] = await Promise.all([requireUser(), getLatestSync()]);

  return (
    <SyncProvider initialRun={run}>
      <Suspense>
        <Sidebar user={user} />
      </Suspense>
      <main className="min-h-dvh lg:pl-64">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-32 lg:px-10 lg:pb-16">{children}</div>
      </main>
      <BottomNav />
    </SyncProvider>
  );
}
