import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

// Ensure DATABASE_URL is set
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing in your environment variables");
}

// Create adapter for PostgreSQL
const adapter = new PrismaPg({ connectionString });

// Use a global singleton in dev to avoid multiple instances
export const db =
  globalForPrisma.db ||
  new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"], // optional: adds logging
  });

// Cache Prisma client in dev mode
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
