"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { processDueRecurringTransactions } from "@/lib/recurring";

export async function processDueRecurringTransactionsForCurrentUser(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) return { processed: 0 };

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!user) return { processed: 0 };

    const processed = await processDueRecurringTransactions(user.id);

    if (processed > 0) {
      revalidatePath("/dashboard");
      if (accountId) {
        revalidatePath(`/account/${accountId}`);
      } else {
        revalidatePath("/account/[id]");
      }
    }

    return { processed };
  } catch (error) {
    console.error("Recurring due check failed:", error);
    return { processed: 0, error: true };
  }
}
