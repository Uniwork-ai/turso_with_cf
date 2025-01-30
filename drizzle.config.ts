import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

export default defineConfig({
  schema: "./src/modules/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_DATABASE_AUTH_TOKEN,
  },
});
