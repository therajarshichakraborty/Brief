ALTER TABLE "articles" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
UPDATE "articles" SET "category" = CASE "category" WHEN 'international' THEN 'world' WHEN 'local' THEN 'india' ELSE "category" END;--> statement-breakpoint
DROP TYPE "public"."category";--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('world', 'india', 'business', 'technology', 'politics', 'sports', 'cricket', 'science', 'health', 'entertainment');--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "category" SET DATA TYPE "public"."category" USING "category"::"public"."category";