import type { CSSProperties } from "react";

const MAX_STAGGERED_ITEMS = 10;

export function stagger(index: number, step = 60, offset = 0): CSSProperties {
  return { animationDelay: `${offset + Math.min(index, MAX_STAGGERED_ITEMS) * step}ms` };
}
