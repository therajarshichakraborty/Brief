"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { setBookmark } from "@/lib/client-api";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  articleId: string;
  bookmarked: boolean;
  className?: string;
}

export function BookmarkButton({ articleId, bookmarked, className }: BookmarkButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticBookmarked, setOptimisticBookmarked] = useOptimistic(bookmarked);
  const [toggleCount, setToggleCount] = useState(0);

  function toggle() {
    const next = !optimisticBookmarked;
    setToggleCount((count) => count + 1);
    startTransition(async () => {
      setOptimisticBookmarked(next);
      try {
        await setBookmark(articleId, next);
      } finally {
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={optimisticBookmarked}
      aria-label={optimisticBookmarked ? "Remove from saved" : "Save story"}
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition duration-200 hover:scale-105 hover:bg-black/50 active:scale-90",
        className,
      )}
    >
      <Heart
        key={toggleCount}
        className={cn(
          "size-5 transition-colors duration-300",
          optimisticBookmarked && "fill-current text-red-500",
          toggleCount > 0 && "animate-heart-pop",
        )}
        strokeWidth={2}
      />
    </button>
  );
}
