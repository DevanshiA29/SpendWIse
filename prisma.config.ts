import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma CLI commands should use the direct connection instead of the pooler.
    url: env("DIRECT_URL"),
  },
});
