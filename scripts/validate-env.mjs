import "dotenv/config";

const requiredServerEnv = ["DATABASE_URL", "DIRECT_URL"];
const requiredPublicEnv = ["NEXT_PUBLIC_SUPABASE_URL"];
const recommendedPublicEnv = [
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
];

function ensurePresent(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

try {
  requiredServerEnv.forEach(ensurePresent);
  requiredPublicEnv.forEach(ensurePresent);

  const hasSupabasePublishableKey = recommendedPublicEnv.some(
    (name) => !!process.env[name],
  );

  if (!hasSupabasePublishableKey) {
    throw new Error(
      `Missing Supabase publishable key. Set one of: ${recommendedPublicEnv.join(", ")}`,
    );
  }

  console.log("Environment variables look good for Prisma + Supabase.");
} catch (error) {
  console.error("Environment validation failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
