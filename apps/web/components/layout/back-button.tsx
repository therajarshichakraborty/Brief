"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/feed");
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50",
        className,
      )}
    >
      <ChevronLeft className="size-5" />
    </button>
  );
}
