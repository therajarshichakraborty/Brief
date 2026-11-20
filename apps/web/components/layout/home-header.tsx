import Link from "next/link";
import { SyncButton, SyncStatus } from "@/components/sync/sync-button";
import { firstName, initials } from "@/lib/format";

export function HomeHeader({ name }: { name: string }) {
  return (
    <header className="flex animate-fade-up items-start justify-between gap-4">
      <div className="min-w-0 space-y-1.5">
        <h1 className="truncate font-display text-[1.75rem] font-semibold text-neutral-900 lg:text-3xl">
          Hi, {firstName(name)}
        </h1>
        <SyncStatus className="text-neutral-500" />
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:hidden">
        <SyncButton />
        <Link
          href="/profile"
          aria-label="Profile"
          className="flex size-12 items-center justify-center rounded-full bg-linear-to-br from-[#0b74c1] to-[#04205c] font-display text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#0b74c1]/30 active:scale-95"
        >
          {initials(name)}
        </Link>
      </div>
    </header>
  );
}
