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
const AddTransactionForm = ({accounts , categories ,editMode = false,
  initialData = null,}) => {

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

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
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
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  // const handleScanComplete = (scannedData) => {
  //   if (scannedData) {
  //     console.log(scannedData);
      
  //     setValue("amount", scannedData.amount.toString());
  //     setValue("date", new Date(scannedData.date));
  //     setValue("description", scannedData.description||"");
  //     const type = scannedData.type === "Income" ? "Income" : "Expense";
  // setValue("type", type);
  //     if (scannedData.category) {
  //       setValue("category", scannedData.category);
  //     }
  //     toast.success("Receipt scanned successfully");
  //   }
  // };

  const defaultCategories = [
  { id: "salary", name: "Salary" },
  { id: "business", name: "Business" },
  { id: "shopping", name: "Shopping" },
  { id: "other-expense", name: "Other Expenses" },
  { id: "other-income", name: "Other Income" },
  {id: "freelance" , name:"Freelance"}
  // ...etc
];

function normalizeCategory(rawCategory, rawType) {
  if (!rawCategory) return rawType === "Income" ? "other-income" : "other-expense";

  const match = defaultCategories.find(
    c => c.name.toLowerCase() === rawCategory.toLowerCase()
  );

  return match ? match.id : rawType === "Income" ? "other-income" : "other-expense";
}

const handleScanComplete = (scannedData) => {
  if (!scannedData) {
    toast.error("No data returned from receipt scan");
    return;
  }

  console.log(scannedData); // ✅ will now log

  setValue("amount", scannedData.amount?.toString() ?? "");
  setValue("date", scannedData.date ? new Date(scannedData.date) : new Date());
  setValue("description", scannedData.description || "");

  const type = scannedData.type === "Income" ? "Income" : "Expense";
  setValue("type", type);

  const normalizedCategory = normalizeCategory(scannedData.category, type);
  setValue("category", normalizedCategory);
};

    const type =watch("type");
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
  className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 shadow-xl border border-white/40 backdrop-blur-md animate-fadeIn"
  onSubmit={handleSubmit(onSubmit)}
>

  <div className="space-y-6">
    { !editMode && <ReceiptScanner onScanComplete={handleScanComplete}/>}

    {/* TYPE */}
    <div className="space-y-2 p-4 rounded-xl bg-white/70 shadow-sm hover:shadow-md transition-all duration-300">
      <label className="text-sm font-medium text-gray-700">Type</label>
      <Select
        onValueChange={(value) => setValue("type", value)}
        defaultValue={type}
      >
        <SelectTrigger className="w-[180px] bg-white/80 border border-blue-200 focus:ring-2 focus:ring-purple-200">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="EXPENSE">Expense</SelectItem>
          <SelectItem value="INCOME">Income</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* AMOUNT + ACCOUNT */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/70 shadow-sm hover:shadow-md transition-all duration-300">
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Amount</label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("amount")}
          className="bg-white/80 border border-blue-200 focus:ring-2 focus:ring-purple-200"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Account</label>
        <Select
          onValueChange={(value) => setValue("accountId", value)}
          defaultValue={getValues("accountId")}
        >
          <SelectTrigger className="bg-white/80 border border-blue-200 focus:ring-2 focus:ring-purple-200">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name} (${parseFloat(account.balance).toFixed(2)})
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
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/70 shadow-sm">
  
    {/* CATEGORY + DATE*/}
    <div className="space-y-2"> <label className="text-sm font-medium">Category</label> <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")} > <SelectTrigger> <SelectValue placeholder="Select category" /> </SelectTrigger> <SelectContent className="bg-white min-w-0 w-[200px]" > {filteredCategories.map((category) => ( <SelectItem key={category.id} value={category.id}> <span className="flex items-center gap-2"> <span className="text-lg">{categoryIcons[category.name]}</span> {category.name} </span> </SelectItem> ))} </SelectContent> </Select> {errors.category && ( <p className="text-sm text-red-500">{errors.category.message}</p> )} </div>

    {/* DATE */}
    <div className="space-y-2 p-4 rounded-xl bg-white/70 shadow-sm hover:shadow-md transition-all duration-300">
      <label className="text-sm font-medium text-gray-700">Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left bg-white/80 border border-blue-200 hover:bg-blue-50",
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
    <div className="space-y-2 p-4 rounded-xl bg-white/70 shadow-sm hover:shadow-md transition-all duration-300">
      <label className="text-sm font-medium text-gray-700">Description</label>
      <Input
        placeholder="Enter description"
        {...register("description")}
        className="bg-white/80 border border-blue-200 focus:ring-2 focus:ring-purple-200"
      />
    </div>

    {/* RECURRING */}
    <div className="flex items-center justify-between p-4 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm">
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
    {/* Recurring Interval */} {isRecurring && ( <div className="space-y-2"> <label className="text-sm font-medium">Recurring Interval</label> <Select onValueChange={(value) => setValue("recurringInterval", value)} defaultValue={getValues("recurringInterval")} > <SelectTrigger > <SelectValue placeholder="Select interval" /> </SelectTrigger> <SelectContent className="bg-slate-50"> <SelectItem value="DAILY">Daily</SelectItem> <SelectItem value="WEEKLY">Weekly</SelectItem> <SelectItem value="MONTHLY">Monthly</SelectItem> <SelectItem value="YEARLY">Yearly</SelectItem> </SelectContent> </Select> {errors.recurringInterval && ( <p className="text-sm text-red-500"> {errors.recurringInterval.message} </p> )} </div> )}

    {/* BUTTONS */}
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
        onClick={() => router.back()}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        disabled={transactionLoading}
        onClick={() => router.back()}
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
