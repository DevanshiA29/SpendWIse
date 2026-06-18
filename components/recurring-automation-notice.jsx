"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { processDueRecurringTransactionsForCurrentUser } from "@/actions/recurring";
import { cn } from "@/lib/utils";

export function RecurringAutomationNotice({
  accountId,
  initialProcessed = 0,
  compact = false,
}) {
  const router = useRouter();
  const hasChecked = useRef(false);
  const [checking, setChecking] = useState(false);
  const [processed, setProcessed] = useState(initialProcessed);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (initialProcessed > 0) {
      toast.success(
        `${initialProcessed} due recurring transaction${
          initialProcessed === 1 ? "" : "s"
        } posted automatically.`,
        {
          description: "Your balance, chart, and transaction list are up to date.",
          duration: 7000,
        }
      );
      return;
    }

    const runCheck = async () => {
      setChecking(true);
      try {
        const result = await processDueRecurringTransactionsForCurrentUser(accountId);
        const count = result?.processed || 0;
        setProcessed(count);

        if (count > 0) {
          toast.success(
            `${count} due recurring transaction${count === 1 ? "" : "s"} posted.`,
            {
              description: "Refreshing the page with the new posted entries.",
              duration: 7000,
            }
          );
          router.refresh();
        }
      } catch (error) {
        toast.error("Recurring check could not run right now.");
      } finally {
        setChecking(false);
      }
    };

    runCheck();
  }, [accountId, initialProcessed, router]);

  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        processed > 0
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-blue-200 bg-blue-50 text-blue-900"
      )}
    >
      <div className="flex items-start gap-3">
        <RefreshCw
          className={cn("mt-0.5 h-4 w-4 shrink-0", checking && "animate-spin")}
        />
        <div>
          <p className="font-semibold">
            {checking
              ? "Checking recurring transactions..."
              : "Recurring automation is active"}
          </p>
          <p
            className={cn(
              processed > 0 ? "text-emerald-800" : "text-blue-800",
              compact && "max-w-3xl"
            )}
          >
            {processed > 0
              ? `${processed} due transaction${
                  processed === 1 ? "" : "s"
                } were posted immediately on page open.`
              : "Due schedules are checked immediately when this page opens, plus by the daily backup job."}
          </p>
        </div>
      </div>
    </div>
  );
}
