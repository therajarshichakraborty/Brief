export const CATEGORIES = [
  "world",
  "india",
  "business",
  "technology",
  "politics",
  "sports",
  "cricket",
  "science",
  "health",
  "entertainment",
  "bangla",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  world: "World",
  india: "India",
  business: "Business",
  technology: "Technology",
  politics: "Politics",
  sports: "Sports",
  cricket: "Cricket",
  science: "Science",
  health: "Health",
  entertainment: "Entertainment",
  bangla: "Bangla",
};

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}
