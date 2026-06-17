import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/prisma";
import { processDueRecurringTransactions } from "@/lib/recurring";

export async function processCurrentUserRecurringSafely() {
  try {
    const { userId } = await auth();
    if (!userId) return { processed: 0 };

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!user) return { processed: 0 };

    const processed = await processDueRecurringTransactions(user.id);
    return { processed };
  } catch (error) {
    console.error("Recurring due check failed:", error);
    return { processed: 0, error: true };
  }
}
