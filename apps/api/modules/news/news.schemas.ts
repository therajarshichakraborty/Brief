import { CATEGORIES } from "@news-aggrigator/contracts";
import { z } from "zod";

export const listArticlesQuerySchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  q: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),
  cursor: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const topStoriesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(25).default(25),
});

export const articleParamsSchema = z.object({
  id: z.uuid(),
});

export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>;
