import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-neutral-900">Story not found</h1>
      <p className="text-neutral-500">It may have been removed or the link is incorrect.</p>
      <Link href="/" className="pt-4 text-sm font-medium text-neutral-900 hover:underline">
        Back to home
      </Link>
    </main>
  );
}
