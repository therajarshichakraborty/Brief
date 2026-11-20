import type { Category } from "@news-aggrigator/contracts";

export function categoryImage(category: Category): string {
  return `/images/categories/${category}.jpg`;
}
