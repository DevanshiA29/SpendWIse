"use client";

import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

import AddTransactionForm from "@/app/(main)/transaction/_components/transaction-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TransactionDialogButton({ accounts, categories }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]">
          <LayoutDashboard size={18} />
          <span className="hidden md:inline font-semibold">Transactions</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto bg-white p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <AddTransactionForm
            accounts={accounts}
            categories={categories}
            compact
            onCancel={() => setOpen(false)}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
