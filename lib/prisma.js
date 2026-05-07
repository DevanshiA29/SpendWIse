import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} is missing. Add it to your environment before starting the app or deploying.`,
    );
  }

  return value;
}

const pooledConnectionString = getRequiredEnv("DATABASE_URL");

// Runtime traffic should go through Supabase's pooled connection string.
const adapter = new PrismaPg({ connectionString: pooledConnectionString });

// Use a global singleton in dev to avoid multiple instances
export const db =
  globalForPrisma.db ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

// Cache Prisma client in dev mode
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
