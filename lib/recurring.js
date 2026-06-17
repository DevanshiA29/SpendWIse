import { db } from "@/lib/prisma";

export async function processDueRecurringTransactions(userId) {
  const dueUntil = endOfToday();
  const templates = await db.transaction.findMany({
    where: {
      userId,
      isRecurring: true,
      status: "COMPLETED",
      nextRecurringDate: {
        lte: dueUntil,
      },
    },
    orderBy: [{ nextRecurringDate: "asc" }, { createdAt: "asc" }],
  });

  let processed = 0;

  for (const template of templates) {
    const didProcess = await processRecurringTemplate(template, dueUntil);
    if (didProcess) processed += 1;
  }

  return processed;
}

async function processRecurringTemplate(template, dueUntil) {
  const nextDate = template.nextRecurringDate
    ? new Date(template.nextRecurringDate)
    : null;

  if (!nextDate || nextDate > dueUntil) return false;

  const nextRecurringDate = calculateNextRecurringDate(
    nextDate,
    template.recurringInterval
  );

  return await db.$transaction(async (tx) => {
    const claimed = await tx.transaction.updateMany({
      where: {
        id: template.id,
        nextRecurringDate: {
          lte: dueUntil,
        },
      },
      data: {
        lastProcessed: new Date(),
        nextRecurringDate,
      },
    });

    if (claimed.count === 0) return false;

    await tx.transaction.create({
      data: {
        type: template.type,
        amount: template.amount,
        description: `${template.description || "Recurring transaction"} (Recurring)`,
        date: nextDate,
        category: template.category,
        userId: template.userId,
        accountId: template.accountId,
        isRecurring: false,
      },
    });

    const balanceChange =
      template.type === "EXPENSE"
        ? -template.amount.toNumber()
        : template.amount.toNumber();

    await tx.account.update({
      where: { id: template.accountId },
      data: { balance: { increment: balanceChange } },
    });

    return true;
  });
}

export function endOfToday() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}
