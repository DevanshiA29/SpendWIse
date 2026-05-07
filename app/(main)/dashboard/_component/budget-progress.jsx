"use client";

import { useState, useEffect } from "react";
import { Wallet, Pencil, Check, X, AlertCircle } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="border-muted/50 overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/20 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-foreground/90">
              Monthly Budget
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Default Account
            </CardDescription>
          </div>
        </div>
        {!isEditing && initialBudget && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)} 
            className="h-8 gap-2 text-muted-foreground hover:text-foreground font-medium rounded-lg"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-muted/30 p-4 rounded-xl border border-muted/50">
            <div className="relative w-full flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                $
              </span>
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="pl-8 bg-white dark:bg-slate-950 h-11 rounded-lg"
                placeholder="Enter budget amount"
                autoFocus
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleUpdateBudget}
                disabled={isLoading}
                className="gap-2 h-11 flex-1 sm:flex-none rounded-lg font-semibold"
              >
                <Check className="h-4 w-4" /> Save
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                size="icon"
                className="h-11 w-11 rounded-lg shrink-0"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ) : initialBudget ? (
          <div className="space-y-6">
            {/* Numbers breakdown */}
            <div className="flex justify-between items-end px-1">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                  Spent This Month
                </p>
                <div className="text-4xl font-extrabold tracking-tight text-foreground">
                  ${currentExpenses.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                  Total Budget
                </p>
                <div className="text-xl font-bold text-foreground/70">
                  ${initialBudget.amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-3">
              <Progress
                value={Math.min(percentUsed, 100)}
                extraStyles={`${
                  percentUsed >= 100
                    ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : percentUsed >= 90
                    ? "bg-red-500"
                    : percentUsed >= 75
                      ? "bg-amber-500"
                      : "bg-primary"
                }`}
                className="h-4 bg-muted rounded-full"
              />
              <div className="flex justify-between items-center text-sm font-medium">
                <span className={`${percentUsed >= 100 ? "text-red-600 dark:text-red-400 font-bold" : "text-muted-foreground"}`}>
                  {percentUsed.toFixed(1)}% used
                </span>
                <span>
                  {percentUsed >= 100 ? (
                    <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1 rounded-full font-bold">
                      <AlertCircle className="h-4 w-4" /> Over budget by ${(currentExpenses - initialBudget.amount).toFixed(2)}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-semibold">
                      ${(initialBudget.amount - currentExpenses).toFixed(2)} remaining
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/10 rounded-xl border border-dashed border-muted">
            <div className="p-3 bg-muted/30 rounded-full mb-3">
              <Wallet className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No Budget Set</h3>
            <p className="text-muted-foreground mb-5 text-sm">
              Set a monthly budget to track your spending effectively.
            </p>
            <Button onClick={() => setIsEditing(true)} className="rounded-lg font-semibold px-6">
              Set Budget
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}