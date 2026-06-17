import "dotenv/config";

const requiredServerEnv = [
  "DATABASE_URL",
  "DIRECT_URL",
  "CLERK_SECRET_KEY",
  "ARCJET_KEY",
];
const requiredPublicEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
];
const recommendedServerEnv = ["GEMINI_API_KEY", "RESEND_API_KEY"];
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

  const missingRecommendedServerEnv = recommendedServerEnv.filter(
    (name) => !process.env[name],
  );

  if (missingRecommendedServerEnv.length > 0) {
    console.warn(
      `Optional integrations disabled until set: ${missingRecommendedServerEnv.join(", ")}`,
    );
  }

  console.log("Environment variables look good for production build.");
} catch (error) {
  console.error("Environment validation failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
