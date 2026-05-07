"use client";

import { Plus, Loader2, Wallet, CreditCard, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    console.log("submit and create", data);
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200/50 dark:border-slate-800/50 sm:rounded-2xl sm:max-w-lg p-6">
        <DialogHeader className="mb-2">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0 shadow-inner">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="space-y-1 text-left">
              <DialogTitle className="text-xl font-bold tracking-tight">
                Create New Account
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Set up a new wallet to track your expenses
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold flex items-center gap-2 px-1">
              <CreditCard className="h-4 w-4 text-primary" />
              Account Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Main Checking"
              className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 transition-all rounded-xl shadow-sm"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs border-red-500 focus:ring-red-200 text-red-500 font-medium text-destructive px-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-semibold flex items-center gap-2 px-1">
                <Plus className="h-4 w-4 text-primary" />
                Account Type
              </label>
              <Select
                value={watch("type")}
                onValueChange={(value) => setValue("type", value, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="type"
                  className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-slate-50 border-slate-200 dark:border-slate-800">
                  <SelectItem value="CURRENT" className="rounded-lg">Current</SelectItem>
                  <SelectItem value="SAVINGS" className="rounded-lg">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-red-500 font-medium text-destructive px-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-semibold flex items-center gap-2 px-1">
                <span className="text-primary font-bold">$</span>
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 pr-10 rounded-xl shadow-sm"
                {...register("balance", { valueAsNumber: true })}
              />
              {errors.balance && (
                <p className="text-xs text-red-500 font-medium text-destructive px-1">
                  {errors.balance.message}
                </p>
              )}
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-4 transition-all hover:border-primary/20 hover:bg-primary/[0.07]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <label htmlFor="isDefault" className="text-sm font-bold cursor-pointer">
                    Set as Default Account
                  </label>
                </div>
                <p className="text-xs text-muted-foreground leading-snug pr-4">
                  Automatically use this account for new transactions
                </p>
              </div>

              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) =>
                  setValue("isDefault", checked, { shouldValidate: true })
                }
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="flex-[2] h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              disabled={createAccountLoading}
            >
              {createAccountLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Wallet...
                </>
              ) : (
                "Create Wallet"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}