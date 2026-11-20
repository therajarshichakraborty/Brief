"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-neutral-900">Something went wrong</h1>
      <p className="text-neutral-500">We could not load the news right now. Please try again.</p>
      <Button onClick={reset} className="mt-4 h-12 rounded-2xl px-8">
        Try again
      </Button>
    </main>
  );
}
