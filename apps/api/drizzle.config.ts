import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run drizzle-kit");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/index.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
