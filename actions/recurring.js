"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { processDueRecurringTransactions } from "@/lib/recurring";

export async function processDueRecurringTransactionsForCurrentUser() {
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
    revalidatePath("/account/[id]");
  }

  return { processed };
}
