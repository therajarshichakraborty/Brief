"use client";

import type { Category } from "@news-aggrigator/contracts";
import Image from "next/image";
import { useState } from "react";
import { categoryImage } from "@/lib/category-images";
import { cn } from "@/lib/utils";

interface ArticleImageProps {
  src: string | null;
  category: Category;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ArticleImage({ src, category, alt, sizes, priority, className }: ArticleImageProps) {
  const [failed, setFailed] = useState(false);
  const useOriginal = Boolean(src) && !failed;

  return (
    <Image
      key={useOriginal ? "original" : "fallback"}
      src={useOriginal && src ? src : categoryImage(category)}
      alt={alt}
      fill
      unoptimized={useOriginal}
      sizes={sizes}
      priority={priority}
      onError={useOriginal ? () => setFailed(true) : undefined}
      className={cn("object-cover", className)}
    />
  );
}
