// app/api/transaction/create/route.js

import aj from "@/lib/arcjet";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = await auth();

  const decision = await aj.protect(req, {
    userId,
    requested: 1,
  });

  if (decision.isDenied()) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      { status: 429 }
    );
  }

 
}