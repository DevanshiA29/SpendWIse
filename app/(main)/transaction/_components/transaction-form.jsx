"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { transactionSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/use-fetch'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Select,SelectTrigger, SelectValue ,SelectItem,SelectContent } from '@/components/ui/select'
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Popover ,PopoverTrigger,PopoverContent} from "@/components/ui/popover";
import { CalendarIcon  , Loader2} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import { toast } from "sonner";
 import { createTransaction, updateTransaction } from '@/actions/transaction'
import { ReceiptScanner } from "./recipt-scanner";
import { formatCurrency } from "@/lib/currency";
const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,
  onSuccess,
  onCancel,
  compact = false,
}) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");


    const {register,
        setValue,
        handleSubmit , 
        formState:{errors},
        watch,
        getValues, reset,
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: 
         editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        :{
            type:"EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
        },
    });

    const {
        loading:transactionLoading,
        fn: transactionFn,
        data: transactionResult,

    }=useFetch(editMode ? updateTransaction :createTransaction);
     
    const onSubmit = async(data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    try {
      if (editMode) {
        await transactionFn(editId, formData);
      } else {
        await transactionFn(formData);
      }
    } catch {
      // useFetch already surfaces the error to the user.
    }
  };
  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      if (onSuccess) {
        onSuccess(transactionResult.data);
      } else {
        router.push(`/account/${transactionResult.data.accountId}`);
      }
    }
  }, [transactionResult, transactionLoading, editMode, onSuccess, reset, router]);

function normalizeCategory(rawCategory, rawType) {
  if (!rawCategory) return rawType === "INCOME" ? "other-income" : "other-expense";

  const cleanCategory = rawCategory.toLowerCase().trim();

  // Try exact match by name or id
  let match = categories.find(
    c => c.name.toLowerCase() === cleanCategory || c.id.toLowerCase() === cleanCategory
  );

  // Fallback: try partial match
  if (!match) {
    match = categories.find(c => c.name.toLowerCase().includes(cleanCategory) || cleanCategory.includes(c.name.toLowerCase()));
  }

  return match ? match.id : rawType === "INCOME" ? "other-income" : "other-expense";
}

const handleScanComplete = (scannedData) => {
  if (!scannedData) {
    toast.error("No data returned from receipt scan");
    return;
  }

  setValue("amount", scannedData.amount?.toString() ?? "");
  setValue("date", scannedData.date ? new Date(scannedData.date) : new Date());
  setValue("description", scannedData.description || "");

  const type = scannedData.type?.toLowerCase() === "income" ? "INCOME" : "EXPENSE";
  setValue("type", type);

  const normalizedCategory = normalizeCategory(scannedData.category, type);
  setValue("category", normalizedCategory);
};

    const type =watch("type");
    const category = watch("category");
    const accountId = watch("accountId");
    const isRecurring = watch("isRecurring");
    const date = watch("date");
   
    const filteredCategories = categories.filter(
    (category) => category.type === type
  );
  const categoryIcons = {
  Housing: "🏠",
  Transportation: "🚗",
  Groceries: "🛒",
  Utilities: "💡",
  Entertainment: "🎬",
  Food: "🍔",
  Shopping: "🛍️",
  Healthcare: "💊",
  Education: "📚",
  "Personal Care": "🧴",
  Travel: "✈️",
  Insurance: "🛡️",
  "Gifts & Donations": "🎁",
  "Bills & Fees": "🧾",
  "Other Expenses": "📦",
   "Salary":"💰",
   "Freelance":"🧑‍💻",
  "Investments":"📈",
 "Business":"🏢",
 "Rental":"🏠",
 "Other Income":"➕"
};

  return (
   <form
  className={cn(
    "rounded-xl border border-slate-200 bg-white shadow-sm animate-fadeIn",
    compact ? "space-y-4 p-4" : "space-y-6 p-6"
  )}
  onSubmit={handleSubmit(onSubmit)}
>

  <div className={compact ? "space-y-4" : "space-y-6"}>
    { !editMode && <ReceiptScanner onScanComplete={handleScanComplete}/>}

    {transactionLoading && (
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
        <Loader2 className="h-4 w-4 animate-spin" />
        {isRecurring ? "Saving recurring schedule..." : "Saving transaction..."}
      </div>
    )}

    {/* TYPE */}
    <div className={cn("space-y-2 rounded-lg bg-slate-50", compact ? "p-3" : "p-4")}>
      <label className="text-sm font-medium text-gray-700">Type</label>
      <Select
        onValueChange={(value) => {
          setValue("type", value);
          setValue("category", "");
        }}
        value={type}
      >
        <SelectTrigger className="w-[180px] bg-white border border-slate-200">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="EXPENSE">Expense</SelectItem>
          <SelectItem value="INCOME">Income</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* AMOUNT + ACCOUNT */}
    <div className={cn("grid grid-cols-1 gap-4 rounded-lg bg-slate-50 md:grid-cols-2", compact ? "p-3" : "p-4")}>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Amount</label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("amount")}
          className="bg-white border border-slate-200"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Account</label>
        <Select
          onValueChange={(value) => setValue("accountId", value)}
          value={accountId}
        >
          <SelectTrigger className="bg-white border border-slate-200">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name} ({formatCurrency(account.balance)})
              </SelectItem>
            ))}
            <CreateAccountDrawer>
              <Button variant="ghost" className="w-full text-left">
                Create Account
              </Button>
            </CreateAccountDrawer>
          </SelectContent>
        </Select>
      </div>
    </div>
<div className={cn("grid grid-cols-1 gap-4 rounded-lg bg-slate-50 md:grid-cols-2", compact ? "p-3" : "p-4")}>
  
    {/* CATEGORY + DATE*/}
    <div className="space-y-2"> 
      <label className="text-sm font-medium">Category</label> 
      <Select 
        key={type} 
        onValueChange={(value) => setValue("category", value)} 
        value={category} 
      > 
        <SelectTrigger> 
          <SelectValue placeholder="Select category" /> 
        </SelectTrigger> 
        <SelectContent className="bg-white min-w-0 w-[200px]" > 
          {filteredCategories.map((category) => ( 
            <SelectItem key={category.id} value={category.id}> 
              <span className="flex items-center gap-2"> 
                <span className="text-lg">{categoryIcons[category.name]}</span> 
                {category.name} 
              </span> 
            </SelectItem> 
          ))} 
        </SelectContent> 
      </Select> 
      {errors.category && ( <p className="text-sm text-red-500">{errors.category.message}</p> )} 
    </div>

    {/* DATE */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left bg-white border border-slate-200 hover:bg-slate-50",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "PPP") : "Pick a date"}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => setValue("date", date)}
          />
        </PopoverContent>
      </Popover>
    </div>
</div>
    {/* DESCRIPTION */}
    <div className={cn("space-y-2 rounded-lg bg-slate-50", compact ? "p-3" : "p-4")}>
      <label className="text-sm font-medium text-gray-700">Description</label>
      <Input
        placeholder="Enter description"
        {...register("description")}
        className="bg-white border border-slate-200"
      />
    </div>

    {/* RECURRING */}
    <div className={cn("flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50", compact ? "p-3" : "p-4")}>
      <div>
        <label className="font-medium">Recurring Transaction</label>
        <p className="text-sm text-muted-foreground">
          Set up recurring schedule
        </p>
      </div>
      <Switch
        checked={isRecurring}
        onCheckedChange={(checked) => setValue("isRecurring", checked)}
      />
    </div>
    {/* Recurring Interval */} {isRecurring && ( <div className={cn("space-y-2 rounded-lg bg-slate-50", compact ? "p-3" : "p-4")}> <label className="text-sm font-medium">Recurring Interval</label> <Select onValueChange={(value) => setValue("recurringInterval", value)} defaultValue={getValues("recurringInterval")} > <SelectTrigger className="bg-white" > <SelectValue placeholder="Select interval" /> </SelectTrigger> <SelectContent className="bg-slate-50"> <SelectItem value="DAILY">Daily</SelectItem> <SelectItem value="WEEKLY">Weekly</SelectItem> <SelectItem value="MONTHLY">Monthly</SelectItem> <SelectItem value="YEARLY">Yearly</SelectItem> </SelectContent> </Select> {errors.recurringInterval && ( <p className="text-sm text-red-500"> {errors.recurringInterval.message} </p> )} </div> )}

    {/* BUTTONS */}
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
        onClick={() => (onCancel ? onCancel() : router.back())}
        disabled={transactionLoading}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transition-all duration-200 hover:shadow-lg"
        disabled={transactionLoading}
      >
        {transactionLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {editMode ? "Updating..." : "Creating..."}
          </>
        ) : editMode ? (
          "Update Transaction"
        ) : (
          "Create Transaction"
        )}
      </Button>
    </div>
  </div>
</form>
  )
}

export default AddTransactionForm
