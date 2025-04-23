import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "ep-ancient-pond-a60le6ak-pooler.us-west-2.aws.neon.tech",
    port: 5432,
    user: "tastify_owner",
    password: process.env.DB_PASSWORD!,
    database: "tastify",
    ssl: "require"
  },
} satisfies Config;
